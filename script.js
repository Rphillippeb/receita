<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Meu Livro de Receitas</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"/>
  <style>
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="bg-gray-100 font-sans">

  <!-- Navbar -->
  <nav class="bg-yellow-400 p-4 shadow-md fixed w-full top-0 z-10">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <span class="text-2xl font-bold text-black">🍽 Meu Livro de Receitas</span>
      <div class="space-x-4 text-black font-semibold">
        <a href="#home" class="hover:underline">Início</a>
        <a href="#bolo" class="hover:underline">Bolo de Cenoura</a>
        <a href="#ingredientes" class="hover:underline">Ingredientes</a>
        <a href="#preparo" class="hover:underline">Modo de Preparo</a>
        <a href="#sobre-nos" class="hover:underline">Sobre Nós</a>
      </div>
    </div>
  </nav>

  <div class="pt-24" id="home">
    <!-- Seção: Início -->
    <section class="bg-yellow-300 py-20 text-center">
      <i class="fas fa-utensils text-orange-500 text-5xl mb-4"></i>
      <h1 class="text-5xl font-bold text-black">Meu Livro de Receitas</h1>
      <p class="text-xl mt-4 text-gray-700">Deliciosas receitas brasileiras para toda a família</p>
      <i class="fas fa-heart text-orange-500 text-3xl mt-6"></i>
    </section>
  </div>

  <!-- Seção: Receita Bolo de Cenoura -->
  <section id="bolo" class="py-20 bg-white text-center">
    <h2 class="text-3xl font-bold text-yellow-600 mb-10">Bolo de Cenoura</h2>
    <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <img src="bolodcenoura.jpg" alt="Bolo de Cenoura" class="w-full h-100 object-cover rounded mb-4">
      <p class="text-gray-700 text-lg mb-4">
        <i class="fas fa-carrot text-orange-500 mr-2"></i>
        O clássico bolo de cenoura brasileiro com cobertura de chocolate.
      </p>
      <p class="mb-2"><i class="fas fa-clock text-orange-500 mr-2"></i>Tempo de preparo: 1 hora</p>
      <p class="mb-2"><i class="fas fa-users text-orange-500 mr-2"></i>Serve: 8 pessoas</p>
      <p><i class="fas fa-star text-orange-500 mr-2"></i>Fofinho, úmido e delicioso!</p>
    </div>
  </section>

  <!-- Seção: Ingredientes -->
  <section id="ingredientes" class="bg-gray-100 py-20">
    <h2 class="text-3xl font-bold text-center text-yellow-600 mb-10">Ingredientes do Bolo</h2>
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-start">
      <div class="bg-white p-6 rounded-lg shadow-lg flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-list text-orange-500 mr-2"></i>Para a Massa</h3>
        <ul class="list-disc pl-6 space-y-2 text-lg text-gray-700">
          <li>3 cenouras médias</li>
          <li>4 ovos</li>
          <li>1 xícara de óleo</li>
          <li>2 xícaras de açúcar</li>
          <li>2 xícaras de farinha de trigo</li>
          <li>1 colher de sopa de fermento em pó</li>
        </ul>
        <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4"><i class="fas fa-cookie-bite text-orange-500 mr-2"></i>Para a Cobertura</h3>
        <ul class="list-disc pl-6 space-y-2 text-lg text-gray-700">
          <li>1 lata de leite condensado</li>
          <li>3 colheres de sopa de chocolate em pó</li>
          <li>1 colher de sopa de manteiga</li>
        </ul>
      </div>
      <img src="ingrendientescenoura.jpg" alt="Ingredientes" class="w-80 h-64 object-cover rounded-lg shadow-lg"/>
    </div>
  </section>

  <!-- Seção: Modo de Preparo -->
  <section id="preparo" class="bg-white py-20">
    <h2 class="text-3xl font-bold text-center text-yellow-600 mb-10">Modo de Preparo</h2>
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
      <div class="bg-gray-50 p-6 rounded-lg shadow-lg flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-4"><i class="fas fa-utensils text-orange-500 mr-2"></i>Massa</h3>
        <ol class="list-decimal pl-6 space-y-3 text-lg text-gray-700">
          <li>Bata as cenouras, ovos e óleo no liquidificador.</li>
          <li>Adicione o açúcar e a farinha em uma tigela.</li>
          <li>Misture com o conteúdo do liquidificador.</li>
          <li>Adicione o fermento por último.</li>
          <li>Despeje em forma untada e leve ao forno a 180°C por 40 min.</li>
        </ol>
        <h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4"><i class="fas fa-candy-cane text-orange-500 mr-2"></i>Cobertura</h3>
        <ol class="list-decimal pl-6 space-y-3 text-lg text-gray-700">
          <li>Misture leite condensado, chocolate e manteiga.</li>
          <li>Cozinhe em fogo baixo até soltar do fundo da panela.</li>
          <li>Despeje sobre o bolo ainda quente.</li>
        </ol>
        <div class="mt-6 bg-yellow-100 p-4 rounded">
          <strong><i class="fas fa-lightbulb text-yellow-600 mr-2"></i>Dica:</strong> Bata bem a cenoura para deixar o bolo mais úmido!
        </div>
      </div>
      <img src="massacrucenoura.jpg" alt="Modo de preparo" class="w-96 h-72 object-cover rounded shadow-lg">
    </div>
  </section>

  <!-- Seção: Sobre Nós -->
  <section id="sobre-nos" class="bg-yellow-50 py-20">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-yellow-600 mb-6">Sobre Nós</h2>
      <p class="text-lg text-gray-700 leading-relaxed">
        O <strong>Meu Livro de Receitas</strong> nasceu da paixão por compartilhar receitas caseiras que aquecem o coração.
        Nosso objetivo é trazer a você pratos tradicionais da culinária brasileira com um toque de amor e simplicidade.
        Todas as receitas são testadas e pensadas para garantir sabor, praticidade e momentos deliciosos com quem você ama.
      </p>
      <div class="mt-8">
        <i class="fas fa-pepper-hot text-orange-500 text-4xl"></i>
      </div>
    </div>
  </section>

</body>
</html>
