<template>
  <div class="layout">
    <header-component v-if="!isAuthPage" :user="currentUser" />
    <main class="container">
      <div class="content-wrapper">
        <slot />
      </div>

      <!-- Кнопка "Наверх" -->
      <button
        v-show="showScrollButton"
        class="scroll-top"
        aria-label="Вернуться наверх"
        @click="scrollToTop"
      >
        <span class="text">Наверх</span>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 12l1.41 1.41L11 7.83V16h2V7.83l5.59 5.59L19.6 12l-8-8-8 8z"
          />
        </svg>
      </button>
    </main>
    <footer>
      <!-- Футер -->
    </footer>
  </div>
</template>

<script setup>
const route = useRoute();
const userStore = useUserStore();

const isAuthPage = computed(() => {
  return ["/authpage", "/regpage"].includes(route.path);
});

const currentUser = computed(() => userStore.currentUser);

/* watch(currentUser, (newValue) => {
 console.log('Текущий пользователь:', newValue);
}); */

const showScrollButton = ref(false);

const handleScroll = () => {
  showScrollButton.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await nextTick();
  if (localStorage.getItem("fitnessToken")) {
    userStore.token = localStorage.getItem("fitnessToken");
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
}

.scroll-top {
  position: fixed;
  bottom: 40px;
  left: 50%;
  font-size: 16px;
  background: #bcec30;
  color: #000;
  border: none;
  border-radius: 30px;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;

}

.scroll-top:hover {
  background: #a9d82a;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.scroll-top .text {
  display: inline-block;
}

@media (max-width: 1160px) {
  .content-wrapper {
    padding: 20px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0;
  }

.scroll-top {
  padding: 8px 15px; 
  border-radius: 25px; 
  font-size: 18px; 
  width: 127px;
  height: 52px;
  left: 70%;
  }
 
 .scroll-top svg {
  width: 16px; 
  height: 16px;
  }
}
</style>
