<template>
    <div class="layout">
      <header>
        <!-- Здесь можно добавить навигацию -->
      </header>
      <main>
        <slot />
      </main>
      <footer>
        <!-- Футер -->
      </footer>
    </div>
  </template>
  
  <script setup>
  // В Nuxt 3 useRoute уже встроен
  const route = useRoute()
  </script>
  
  <style scoped>
  .layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  main {
    flex: 1;
    padding: 20px;
  }
  </style>