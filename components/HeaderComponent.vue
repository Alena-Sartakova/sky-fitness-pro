<template>
  <div class="container">
    <header class="header">
      <div class="left-section" @click="goToHome">
        <img
          src="../assets/img/logo.svg"
          alt="Логотип"
          class="logo"
          @click.prevent
        />
        <span class="logo-text">Онлайн-тренировки для дома</span>
      </div>

      <!-- Отображаем пользователя или кнопку входа -->
      <div v-if="currentUser" class="user-section">
        <button class="user-dropdown" @click="showDropdown = !showDropdown">
          <!-- Десктопная версия -->
           <img src="../assets/img/icon/Profile.svg">
          <span class="desktop-name">{{ userDisplayName }}</span>

          <!-- Мобильная иконка -->
          <img
            src="../assets/img/icon/Profile.svg"
            class="mobile-icon"
            alt="Профиль"
          />

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
    <AuthModal
      v-if="showModal"
      :show-modal="showModal"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const showModal = ref(false);

const showDropdown = ref(false);
const router = useRouter();

// Получаем текущего пользователя
const currentUser = computed(() => userStore.currentUser);

const userDisplayName = computed(() => {
  if (!currentUser.value?.user) return "";
  const emailParts = currentUser.value.user.email.split("@");
  return emailParts[0].replace(/\./g, " ");
});

const handleLogout = () => {
  userStore.logout();
  showDropdown.value = false;
};

const goToProfile = () => {
  showDropdown.value = false;
  router.push("/userpage");
};

const goToHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.header {
  max-width: 1160px;
  margin: 0 auto;
  padding-bottom: 20px;
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

      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  .user-section {
    position: relative;
    cursor: pointer;
  }

  .desktop-name {
    padding-left: 16px;
  }

  .user-dropdown {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .desktop-name {
      @media (max-width: 768px) {
        display: none;
      }
    }

    .mobile-icon {
      display: none;
      width: 24px;
      height: 24px;

      @media (max-width: 768px) {
        display: block;
      }
    }

    .dropdown-icon {
      width: 12px;
      height: 6px;
      margin-left: 8px;
      transition: transform 0.3s;
    }

    &.active .dropdown-icon {
      transform: rotate(180deg);
    }

    @media (max-width: 768px) {
      padding: 8px;
    }
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
  display: flex;
  flex-direction: column;
  align-items: center;

  p:first-child { // Имя пользователя
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
    font-weight: 500;
    line-height: 1.5;
  }

  p:nth-child(2) { // Email
    color: #999999;
    font-size: 14px;
    margin-bottom: 34px;
    line-height: 1.4;
  }

  .custom-btn {
    margin-bottom: 10px;
  }

  .custom-btn-exit {
    margin-top: 10px;
  }
}

  .custom-btn {
    width: 100%;
    max-width: 200px;
    padding: 12px;
    border-radius: 16px;
    font-size: 18px;
    transition: all 0.3s ease;
    background-color: #bcec30;

    &:hover {
      background-color: #000000;
      color: #ffffff;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    @media (max-width: 768px) {
      width: 100%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
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
    font-size: 18px;

    &:hover {
      background-color: #f5f5f5;
      border-color: #666;
    }
  }
}

@media (max-width: 768px) {
  .header {
    margin-top: 20px;
    padding: 0 15px;
  }
}
</style>
