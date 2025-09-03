<template>
  <div class="container">
    <header class="header">
      <div class="left-section">
        <img src="../assets/img/logo.svg" alt="Логотип" class="logo" />
        <span class="logo-text">Онлайн-тренировки для дома</span>
      </div>

      <!-- Отображаем пользователя или кнопку входа -->
      <div v-if="currentUser" class="user-section">
        <button class="user-dropdown" @click="showDropdown = !showDropdown">
          {{ userDisplayName }}
          <svg class="dropdown-icon" viewBox="0 0 10 6" fill="currentColor">
            <path d="M0 0l5 5 5-5" />
          </svg>
        </button>

        <!-- Выпадающее меню -->
        <div v-if="showDropdown" class="dropdown-menu">
          <div class="dropdown-content">
            <p>{{ userDisplayName }}</p>
            <p>{{ currentUser.user.email }}</p>
            <button class="custom-btn" @click="goToProfile">Мой профиль</button>
            <button class="custom-btn-exit" @click="handleLogout">Выйти</button>
          </div>
        </div>
      </div>

      <!-- Кнопка входа, если пользователь не авторизован -->
      <button v-else class="custom-btn" @click="showModal = true">Войти</button>
    </header>

    <!-- Модальное окно -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <AuthForm
        :is-modal="true"
          :is-visible="true"
          :is-login="isLogin"
          @close="showModal = false"
          @toggle-mode="toggleMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const showModal = ref(false);
const isLogin = ref(true);
const showDropdown = ref(false);

// Получаем текущего пользователя
const currentUser = computed(() => userStore.currentUser);

const userDisplayName = computed(() => {
  if (!currentUser.value?.user) return "";
  const emailParts = currentUser.value.user.email.split("@");
  return emailParts[0].replace(/\./g, " ");
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
};

const handleLogout = () => {
  userStore.logout();
  showDropdown.value = false;
};

const goToProfile = () => {
  // Здесь логика перехода на страницу профиля
};
</script>

<style lang="scss" scoped>
.header {
  max-width: 1160px;
  margin: 0 auto;
  padding-bottom: 20px;
  padding-right: 20px;
  padding-left: 20px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;

  .left-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    .logo {
      display: block;
      max-height: 40px;
    }

    .logo-text {
      font-size: 16px;
      line-height: 1.2;
    }
  }

  .user-section {
    position: relative;
    cursor: pointer;
  }

  .user-dropdown {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .dropdown-icon {
    width: 12px;
    height: 6px;
    margin-left: 8px;
    transition: transform 0.3s;
  }

  .user-dropdown.active .dropdown-icon {
    transform: rotate(180deg);
  }

  .dropdown-menu {
    width: 266px;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    z-index: 1000;
    overflow: hidden;
  }

  .dropdown-content {
    padding: 24px 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    p {
      margin: 0;
      font-weight: 500;
      color: #333;
      font-size: 16px;
      line-height: 1.5;
    }
  }


  .custom-btn {
    width: 100%;
    max-width: 200px;
    padding: 12px;
    border-radius: 16px;
    font-size: 14px;
    transition: all 0.3s ease;
    background-color: #bcec30;
    
    &:hover {
        background-color: #000000;
        color: #ffffff;
  transition: background-color 0.3s ease, color 0.3s ease;
      }  
  }



  .custom-btn-exit {
    width: 100%;
    max-width: 200px;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid #000;
    color: #000;
    font-size: 14px;
    transition: all 0.3s ease;
    background-color: white;

    &:hover {
        background-color: #f5f5f5;
        border-color: #666;
      }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-content {
    background-color: #fff;
    padding: 40px;
    border-radius: 16px;
    width: 100%;
    max-width: 360px;
    min-height: 425px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>
