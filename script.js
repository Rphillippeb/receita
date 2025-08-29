// API URLs e Configurações
const MEAL_API_BASE = "https://www.themealdb.com/api/json/v1/1"
const NUTRITION_APIS = {
  // API Ninjas - Gratuita para testes (até 50.000 requests/mês)
  ninjas: {
    url: "https://api.api-ninjas.com/v1/nutrition",
    key: "YOUR_API_NINJAS_KEY", // Obtenha em: https://api.api-ninjas.com/
    headers: { "X-Api-Key": "YOUR_API_NINJAS_KEY" },
  },
  // USDA FoodData Central - Completamente gratuita
  usda: {
    url: "https://api.nal.usda.gov/fdc/v1/foods/search",
    key: "YOUR_USDA_API_KEY", // Obtenha em: https://fdc.nal.usda.gov/api-guide.html
    params: "api_key=YOUR_USDA_API_KEY",
  },
  // Spoonacular - 150 requests/dia gratuitos
  spoonacular: {
    url: "https://api.spoonacular.com/recipes/parseIngredients",
    key: "YOUR_SPOONACULAR_KEY", // Obtenha em: https://spoonacular.com/food-api
    params: "apiKey=YOUR_SPOONACULAR_KEY",
  },
}

let currentRecipes = []
let displayedRecipes = 0
const recipesPerPage = 6

// Dados de conversão de unidades
const conversionTable = {
  // Volume
  cup: { ml: 240, tbsp: 16, tsp: 48 },
  ml: { cup: 1 / 240, tbsp: 1 / 15, tsp: 1 / 5 },
  tbsp: { cup: 1 / 16, ml: 15, tsp: 3 },
  tsp: { cup: 1 / 48, ml: 5, tbsp: 1 / 3 },

  // Peso
  g: { kg: 1 / 1000, oz: 28.35 },
  kg: { g: 1000, oz: 1 / 28.35 },
  oz: { g: 1 / 28.35, kg: 35.274 },
}

// Dados nutricionais simulados (por 100g)
const nutritionData = {
  arroz: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  frango: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  tomate: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  cebola: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
  alho: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
  batata: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  cenoura: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  brócolis: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
  ovo: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  leite: { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
}

// Inicialização quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Página carregada, inicializando...")

  // Carregar receitas em destaque na página inicial
  if (document.getElementById("featuredRecipes")) {
    loadFeaturedRecipes()
  }

  // Carregar todas as receitas na página de receitas
  if (document.getElementById("allRecipes")) {
    loadAllRecipes()
    setupRecipeFilters()
  }

  // Setup do formulário de contato
  if (document.getElementById("contactForm")) {
    setupContactForm()
  }

  // Setup da navegação mobile
  setupMobileNavigation()

  // Setup do newsletter
  setupNewsletterForm()
})

// === API 1: RECEITAS (TheMealDB) ===

async function loadFeaturedRecipes() {
  console.log("[v0] Carregando receitas em destaque...")
  const container = document.getElementById("featuredRecipes")

  try {
    // Buscar receitas aleatórias
    const recipes = []
    for (let i = 0; i < 6; i++) {
      const response = await fetch(`${MEAL_API_BASE}/random.php`)
      const data = await response.json()
      if (data.meals && data.meals[0]) {
        recipes.push(data.meals[0])
      }
    }

    displayRecipes(recipes, container)
    console.log("[v0] Receitas em destaque carregadas:", recipes.length)
  } catch (error) {
    console.error("[v0] Erro ao carregar receitas:", error)
    container.innerHTML = '<p class="text-center">Erro ao carregar receitas. Tente novamente mais tarde.</p>'
  }
}

async function loadAllRecipes() {
  console.log("[v0] Carregando todas as receitas...")
  const container = document.getElementById("allRecipes")

  try {
    // Carregar receitas de diferentes categorias
    const categories = ["beef", "chicken", "seafood", "vegetarian", "dessert"]
    currentRecipes = []

    for (const category of categories) {
      const response = await fetch(`${MEAL_API_BASE}/filter.php?c=${category}`)
      const data = await response.json()
      if (data.meals) {
        currentRecipes.push(...data.meals.slice(0, 4)) // 4 receitas por categoria
      }
    }

    // Embaralhar receitas
    currentRecipes = shuffleArray(currentRecipes)
    displayedRecipes = 0
    displayMoreRecipes()

    console.log("[v0] Total de receitas carregadas:", currentRecipes.length)
  } catch (error) {
    console.error("[v0] Erro ao carregar receitas:", error)
    container.innerHTML = '<p class="text-center">Erro ao carregar receitas. Tente novamente mais tarde.</p>'
  }
}

function displayRecipes(recipes, container) {
  const recipesHTML = recipes
    .map(
      (recipe) => `
        <div class="recipe-card">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
            <div class="recipe-card-content">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strCategory || "Categoria"} • ${recipe.strArea || "Internacional"}</p>
                <div class="recipe-meta">
                    <span>⏱️ 30 min</span>
                    <span>👥 4 porções</span>
                    <span>⭐ 4.5</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  container.innerHTML = recipesHTML
}

function displayMoreRecipes() {
  const container = document.getElementById("allRecipes")
  const recipesToShow = currentRecipes.slice(displayedRecipes, displayedRecipes + recipesPerPage)

  if (displayedRecipes === 0) {
    container.innerHTML = ""
  }

  const recipesHTML = recipesToShow
    .map(
      (recipe) => `
        <div class="recipe-card">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
            <div class="recipe-card-content">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strCategory || "Categoria"} • ${recipe.strArea || "Internacional"}</p>
                <div class="recipe-meta">
                    <span>⏱️ 30 min</span>
                    <span>👥 4 porções</span>
                    <span>⭐ 4.5</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  container.innerHTML += recipesHTML
  displayedRecipes += recipesToShow.length

  // Esconder botão "Carregar Mais" se não há mais receitas
  const loadMoreBtn = document.getElementById("loadMoreBtn")
  if (loadMoreBtn && displayedRecipes >= currentRecipes.length) {
    loadMoreBtn.style.display = "none"
  }
}

function loadMoreRecipes() {
  console.log("[v0] Carregando mais receitas...")
  displayMoreRecipes()
}

async function searchRecipes() {
  const query = document.getElementById("recipeSearch").value.trim()
  const resultsContainer = document.getElementById("searchResults")

  if (!query) {
    resultsContainer.innerHTML = "<p>Digite um ingrediente ou nome do prato para buscar.</p>"
    return
  }

  console.log("[v0] Buscando receitas para:", query)
  resultsContainer.innerHTML = "<p>Buscando receitas...</p>"

  try {
    // Buscar por nome
    const nameResponse = await fetch(`${MEAL_API_BASE}/search.php?s=${query}`)
    const nameData = await nameResponse.json()

    // Buscar por ingrediente principal
    const ingredientResponse = await fetch(`${MEAL_API_BASE}/filter.php?i=${query}`)
    const ingredientData = await ingredientResponse.json()

    let recipes = []
    if (nameData.meals) recipes.push(...nameData.meals)
    if (ingredientData.meals) recipes.push(...ingredientData.meals)

    // Remover duplicatas
    recipes = recipes.filter((recipe, index, self) => index === self.findIndex((r) => r.idMeal === recipe.idMeal))

    if (recipes.length > 0) {
      const recipesHTML = recipes
        .slice(0, 6)
        .map(
          (recipe) => `
                <div class="recipe-card" style="margin-bottom: 1rem;">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; float: left; margin-right: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">${recipe.strMeal}</h4>
                        <p style="margin: 0; font-size: 0.9rem; color: var(--gray-600);">${recipe.strCategory} • ${recipe.strArea}</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>
            `,
        )
        .join("")

      resultsContainer.innerHTML = `
                <h4>Encontradas ${recipes.length} receitas:</h4>
                ${recipesHTML}
            `
    } else {
      resultsContainer.innerHTML = "<p>Nenhuma receita encontrada. Tente outro termo de busca.</p>"
    }

    console.log("[v0] Receitas encontradas:", recipes.length)
  } catch (error) {
    console.error("[v0] Erro na busca:", error)
    resultsContainer.innerHTML = "<p>Erro ao buscar receitas. Tente novamente.</p>"
  }
}

async function searchRecipesPage() {
  const query = document.getElementById("recipeSearchPage").value.trim()
  const container = document.getElementById("allRecipes")

  if (!query) {
    loadAllRecipes()
    return
  }

  console.log("[v0] Buscando receitas na página:", query)
  container.innerHTML = '<div class="loading">Buscando receitas...</div>'

  try {
    const response = await fetch(`${MEAL_API_BASE}/search.php?s=${query}`)
    const data = await response.json()

    if (data.meals) {
      displayRecipes(data.meals, container)
      document.getElementById("loadMoreBtn").style.display = "none"
    } else {
      container.innerHTML = '<p class="text-center">Nenhuma receita encontrada.</p>'
    }
  } catch (error) {
    console.error("[v0] Erro na busca:", error)
    container.innerHTML = '<p class="text-center">Erro ao buscar receitas.</p>'
  }
}

// === API 2: ANÁLISE NUTRICIONAL ===

async function analyzeNutritionWithAPI(ingredients) {
  const resultsContainer = document.getElementById("nutritionResults")

  try {
    console.log("[v0] Usando API Ninjas para análise nutricional...")

    // Processar cada linha de ingrediente
    const lines = ingredients.split("\n").filter((line) => line.trim())
    const nutritionPromises = lines.map(async (line) => {
      const cleanIngredient = line.replace(/\d+g?\s*/i, "").trim()

      const response = await fetch(`${NUTRITION_APIS.ninjas.url}?query=${encodeURIComponent(cleanIngredient)}`, {
        headers: NUTRITION_APIS.ninjas.headers,
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    })

    const results = await Promise.all(nutritionPromises)
    const validResults = results.filter((result) => result && result.length > 0)

    if (validResults.length > 0) {
      // Somar todos os valores nutricionais
      const totalNutrition = validResults.reduce(
        (total, result) => {
          const item = result[0] // Primeiro item do resultado
          return {
            calories: total.calories + (item.calories || 0),
            protein: total.protein + (item.protein_g || 0),
            carbs: total.carbs + (item.carbohydrates_total_g || 0),
            fat: total.fat + (item.fat_total_g || 0),
            fiber: total.fiber + (item.fiber_g || 0),
            sugar: total.sugar + (item.sugar_g || 0),
            sodium: total.sodium + (item.sodium_mg || 0),
          }
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
      )

      displayNutritionResults(totalNutrition, validResults.length)
    } else {
      throw new Error("Nenhum ingrediente reconhecido pela API")
    }
  } catch (error) {
    console.error("[v0] Erro na API de nutrição:", error)
    // Fallback para dados simulados
    analyzeNutritionFallback(ingredients)
  }
}

async function analyzeNutritionUSDA(ingredients) {
  try {
    console.log("[v0] Usando USDA FoodData Central API...")

    const lines = ingredients.split("\n").filter((line) => line.trim())
    const nutritionData = []

    for (const line of lines) {
      const cleanIngredient = line.replace(/\d+g?\s*/i, "").trim()

      const response = await fetch(
        `${NUTRITION_APIS.usda.url}?query=${encodeURIComponent(cleanIngredient)}&${NUTRITION_APIS.usda.params}&pageSize=1`,
      )

      if (response.ok) {
        const data = await response.json()
        if (data.foods && data.foods.length > 0) {
          nutritionData.push(data.foods[0])
        }
      }
    }

    if (nutritionData.length > 0) {
      // Processar dados da USDA (estrutura mais complexa)
      const totalNutrition = processUSDANutrition(nutritionData)
      displayNutritionResults(totalNutrition, nutritionData.length)
    } else {
      throw new Error("Nenhum ingrediente encontrado na base USDA")
    }
  } catch (error) {
    console.error("[v0] Erro na USDA API:", error)
    analyzeNutritionFallback(ingredients)
  }
}

function processUSDANutrition(foods) {
  return foods.reduce(
    (total, food) => {
      const nutrients = food.foodNutrients || []

      // Mapear nutrientes da USDA (IDs específicos)
      const calories = nutrients.find((n) => n.nutrientId === 1008)?.value || 0
      const protein = nutrients.find((n) => n.nutrientId === 1003)?.value || 0
      const carbs = nutrients.find((n) => n.nutrientId === 1005)?.value || 0
      const fat = nutrients.find((n) => n.nutrientId === 1004)?.value || 0
      const fiber = nutrients.find((n) => n.nutrientId === 1079)?.value || 0

      return {
        calories: total.calories + calories,
        protein: total.protein + protein,
        carbs: total.carbs + carbs,
        fat: total.fat + fat,
        fiber: total.fiber + fiber,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  )
}

function displayNutritionResults(nutrition, ingredientCount) {
  const resultsContainer = document.getElementById("nutritionResults")

  resultsContainer.innerHTML = `
    <h4>Análise Nutricional Total (API Real):</h4>
    <div class="nutrition-chart">
      <div class="nutrition-item">
        <div class="nutrition-value">${Math.round(nutrition.calories)}</div>
        <div class="nutrition-label">Calorias</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${nutrition.protein.toFixed(1)}g</div>
        <div class="nutrition-label">Proteína</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${nutrition.carbs.toFixed(1)}g</div>
        <div class="nutrition-label">Carboidratos</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${nutrition.fat.toFixed(1)}g</div>
        <div class="nutrition-label">Gordura</div>
      </div>
      <div class="nutrition-item">
        <div class="nutrition-value">${nutrition.fiber.toFixed(1)}g</div>
        <div class="nutrition-label">Fibra</div>
      </div>
      ${
        nutrition.sugar !== undefined
          ? `
        <div class="nutrition-item">
          <div class="nutrition-value">${nutrition.sugar.toFixed(1)}g</div>
          <div class="nutrition-label">Açúcar</div>
        </div>
      `
          : ""
      }
      ${
        nutrition.sodium !== undefined
          ? `
        <div class="nutrition-item">
          <div class="nutrition-value">${nutrition.sodium.toFixed(0)}mg</div>
          <div class="nutrition-label">Sódio</div>
        </div>
      `
          : ""
      }
    </div>
    <div style="margin-top: 1rem; padding: 1rem; background-color: var(--success-color); color: white; border-radius: 8px;">
      <p style="margin: 0; font-size: 0.9rem;">
        ✅ Análise baseada em ${ingredientCount} ingrediente(s) usando API real de nutrição.
      </p>
    </div>
    <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--gray-600);">
      <p><strong>Como configurar as APIs:</strong></p>
      <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
        <li><strong>API Ninjas:</strong> Cadastre-se em <a href="https://api.api-ninjas.com/" target="_blank">api.api-ninjas.com</a> (50.000 requests/mês grátis)</li>
        <li><strong>USDA FoodData:</strong> Cadastre-se em <a href="https://fdc.nal.usda.gov/api-guide.html" target="_blank">fdc.nal.usda.gov</a> (completamente gratuito)</li>
        <li><strong>Spoonacular:</strong> Cadastre-se em <a href="https://spoonacular.com/food-api" target="_blank">spoonacular.com</a> (150 requests/dia grátis)</li>
      </ul>
    </div>
  `
}

function analyzeNutritionFallback(ingredients) {
  console.log("[v0] Usando dados simulados como fallback...")

  const resultsContainer = document.getElementById("nutritionResults")
  const lines = ingredients.split("\n").filter((line) => line.trim())
  const totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  let foundIngredients = 0

  lines.forEach((line) => {
    const match = line.match(/(\d+)\s*g?\s*(.+)/i)
    if (match) {
      const amount = Number.parseInt(match[1])
      const ingredient = match[2].toLowerCase().trim()

      const foundKey = Object.keys(nutritionData).find((key) => ingredient.includes(key) || key.includes(ingredient))

      if (foundKey) {
        const nutrition = nutritionData[foundKey]
        const factor = amount / 100

        totalNutrition.calories += nutrition.calories * factor
        totalNutrition.protein += nutrition.protein * factor
        totalNutrition.carbs += nutrition.carbs * factor
        totalNutrition.fat += nutrition.fat * factor
        totalNutrition.fiber += nutrition.fiber * factor
        foundIngredients++
      }
    }
  })

  if (foundIngredients > 0) {
    resultsContainer.innerHTML = `
      <h4>Análise Nutricional Total (Dados Simulados):</h4>
      <div class="nutrition-chart">
        <div class="nutrition-item">
          <div class="nutrition-value">${Math.round(totalNutrition.calories)}</div>
          <div class="nutrition-label">Calorias</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${totalNutrition.protein.toFixed(1)}g</div>
          <div class="nutrition-label">Proteína</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${totalNutrition.carbs.toFixed(1)}g</div>
          <div class="nutrition-label">Carboidratos</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${totalNutrition.fat.toFixed(1)}g</div>
          <div class="nutrition-label">Gordura</div>
        </div>
        <div class="nutrition-item">
          <div class="nutrition-value">${totalNutrition.fiber.toFixed(1)}g</div>
          <div class="nutrition-label">Fibra</div>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background-color: var(--warning-color); color: white; border-radius: 8px;">
        <p style="margin: 0; font-size: 0.9rem;">
          ⚠️ Usando dados simulados. Configure uma API real para resultados precisos.
        </p>
      </div>
    `
  } else {
    resultsContainer.innerHTML = `
      <p>Não foi possível reconhecer os ingredientes. Tente usar nomes mais simples como:</p>
      <p><strong>Exemplo:</strong><br>
      100g arroz<br>
      200g frango<br>
      1 tomate</p>
    `
  }
}

function analyzeNutrition() {
  const ingredients = document.getElementById("ingredientsList").value.trim()
  const resultsContainer = document.getElementById("nutritionResults")

  if (!ingredients) {
    resultsContainer.innerHTML = "<p>Digite os ingredientes para análise nutricional.</p>"
    return
  }

  console.log("[v0] Analisando nutrição para:", ingredients)
  resultsContainer.innerHTML = "<p>Analisando ingredientes com APIs reais...</p>"

  // Verificar se alguma API está configurada
  if (NUTRITION_APIS.ninjas.key !== "YOUR_API_NINJAS_KEY") {
    analyzeNutritionWithAPI(ingredients)
  } else if (NUTRITION_APIS.usda.key !== "YOUR_USDA_API_KEY") {
    analyzeNutritionUSDA(ingredients)
  } else {
    // Usar dados simulados se nenhuma API estiver configurada
    analyzeNutritionFallback(ingredients)
  }
}

// === API 3: CONVERSOR DE UNIDADES ===

function convertUnits() {
  const value = Number.parseFloat(document.getElementById("convertValue").value)
  const fromUnit = document.getElementById("fromUnit").value
  const toUnit = document.getElementById("toUnit").value
  const resultContainer = document.getElementById("conversionResult")

  if (!value || value <= 0) {
    resultContainer.innerHTML = "<p>Digite um valor válido para conversão.</p>"
    return
  }

  if (fromUnit === toUnit) {
    resultContainer.innerHTML = `<p><strong>${value} ${getUnitName(fromUnit)} = ${value} ${getUnitName(toUnit)}</strong></p>`
    return
  }

  console.log("[v0] Convertendo:", value, fromUnit, "para", toUnit)

  try {
    let result

    // Verificar se a conversão é possível
    if (conversionTable[fromUnit] && conversionTable[fromUnit][toUnit]) {
      result = value * conversionTable[fromUnit][toUnit]
    } else if (conversionTable[toUnit] && conversionTable[toUnit][fromUnit]) {
      result = value / conversionTable[toUnit][fromUnit]
    } else {
      resultContainer.innerHTML = "<p>Conversão não disponível entre essas unidades.</p>"
      return
    }

    resultContainer.innerHTML = `
            <div style="text-align: center; padding: 1rem; background-color: var(--primary-color); color: white; border-radius: 8px;">
                <h4 style="margin: 0 0 0.5rem 0;">${value} ${getUnitName(fromUnit)}</h4>
                <div style="font-size: 1.5rem; margin: 0.5rem 0;">⬇️</div>
                <h3 style="margin: 0; font-size: 1.8rem;">${result.toFixed(2)} ${getUnitName(toUnit)}</h3>
            </div>
        `

    console.log("[v0] Conversão realizada:", result)
  } catch (error) {
    console.error("[v0] Erro na conversão:", error)
    resultContainer.innerHTML = "<p>Erro ao converter unidades. Tente novamente.</p>"
  }
}

function getUnitName(unit) {
  const unitNames = {
    cup: "xícara(s)",
    ml: "ml",
    tbsp: "colher(es) de sopa",
    tsp: "colher(es) de chá",
    g: "gramas",
    kg: "quilos",
    oz: "onças",
  }
  return unitNames[unit] || unit
}

// === FUNÇÕES AUXILIARES ===

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// === SETUP DE FILTROS E NAVEGAÇÃO ===

function setupRecipeFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover classe active de todos os botões
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Adicionar classe active ao botão clicado
      this.classList.add("active")

      const category = this.dataset.category
      console.log("[v0] Filtrando por categoria:", category)

      if (category === "all") {
        loadAllRecipes()
      } else {
        filterRecipesByCategory(category)
      }
    })
  })
}

async function filterRecipesByCategory(category) {
  const container = document.getElementById("allRecipes")
  container.innerHTML = '<div class="loading">Carregando receitas...</div>'

  try {
    const response = await fetch(`${MEAL_API_BASE}/filter.php?c=${category}`)
    const data = await response.json()

    if (data.meals) {
      displayRecipes(data.meals.slice(0, 12), container)
      document.getElementById("loadMoreBtn").style.display = "none"
    } else {
      container.innerHTML = '<p class="text-center">Nenhuma receita encontrada nesta categoria.</p>'
    }
  } catch (error) {
    console.error("[v0] Erro ao filtrar receitas:", error)
    container.innerHTML = '<p class="text-center">Erro ao carregar receitas.</p>'
  }
}

function setupMobileNavigation() {
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }
}

function setupContactForm() {
  const form = document.getElementById("contactForm")

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const data = Object.fromEntries(formData)

      console.log("[v0] Dados do formulário de contato:", data)

      // Simular envio
      alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
      form.reset()
    })
  }
}

function setupNewsletterForm() {
  const forms = document.querySelectorAll(".newsletter-form")

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = form.querySelector('input[type="email"]').value
      console.log("[v0] Cadastro newsletter:", email)

      alert("Cadastro realizado com sucesso! Você receberá nossas receitas semanais.")
      form.reset()
    })
  })
}

// Permitir busca com Enter
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    if (e.target.id === "recipeSearch") {
      searchRecipes()
    } else if (e.target.id === "recipeSearchPage") {
      searchRecipesPage()
    }
  }
})

console.log("[v0] Script carregado com sucesso!")
