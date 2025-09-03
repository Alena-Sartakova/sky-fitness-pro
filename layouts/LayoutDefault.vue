<template>
  <div class="layout">
    <header-component v-if="!isAuthPage" :user="currentUser"/>
    <main class="container">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
    <footer>
      <!-- Футер -->
    </footer>
  </div>
</template>

<script setup>
// В Nuxt 3 useRoute уже встроен
const route = useRoute();
const userStore = useUserStore();

const isAuthPage = computed(() => {
  return ['/authpage', '/regpage'].includes(route.path)
})

const currentUser = computed(() => userStore.currentUser);

watch(currentUser, (newValue) => {
 console.log('Текущий пользователь:', newValue);
});

onMounted(async () => {
  if (userStore.token) {
    await userStore.fetchUserData();
  }
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.container {
  width: 100%;
  margin: 0 auto;
}

.content-wrapper {
  max-width: 1160px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 1160px) {
  .content-wrapper {
    padding: 20px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
}
</style>
