<template>
  <div class="profile-container">
    <div v-if="isLoading" class="loading">
      <p>Загрузка данных профиля...</p>
    </div>

    <div v-else-if="!userStore.isAuthenticated" class="auth-required">
      <p>Пожалуйста, войдите в систему</p>
    </div>

    <div v-else class="profile-content">
      <h1>Мой профиль</h1>

      <div class="profile-info">
        <div class="avatar">
          <img src="../assets/img/profile.png" />
        </div>

        <div class="details">
          <p><strong>Имя:</strong> {{ userDisplayName || "Не указано" }}</p>
          <p><strong>Email:</strong> {{ user.email || "Не указан" }}</p>
        </div>
      </div>

      <button class="logout-btn" @click="handleLogout">Выйти из системы</button>
    </div>

    <!-- Добавляем условие отображения курсов только при авторизации -->
    <div v-if="userStore.isAuthenticated">
      <h1>Мои курсы</h1>
      <div class="courses-grid">
        <CardCaseComponent
          v-if="!isLoading"
          :courses="userCourses || []"
          :is-loading="coursesStore.isLoading"
          :has-error="coursesStore.error"
          :is-profile-page="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { useCoursesStore } from "@/stores/courses";
import { computed, onMounted } from "vue";

const userStore = useUserStore();
const coursesStore = useCoursesStore();
const isLoading = computed(() => userStore.isLoading);

// Получаем данные пользователя
const user = computed(() => {
  if (userStore.currentUser && userStore.currentUser.user) {
    return userStore.currentUser.user;
  }
  return {};
});

// Вычисляем имя из email
const userDisplayName = computed(() => {
  if (!user.value?.email) return "";
  const emailParts = user.value.email.split("@");
  return emailParts[0].replace(/\./g, " ");
});

// Получаем отфильтрованные курсы
const userCourses = computed(() => coursesStore.getUserCourses);

const waitForUser = async () => {
  return new Promise((resolve) => {
    const check = () => {
      if (userStore.currentUser && userStore.currentUser.user) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

onMounted(async () => {
  await waitForUser();
  try {
    const courseIds = userStore.currentUser?.user?.selectedCourses || [];

    await coursesStore.fetchCourses();

    if (courseIds.length > 0) {

      await coursesStore.fetchUserCourses(courseIds);
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  } 
});

const handleLogout = () => {
  userStore.logout();
  // navigateTo('/login');
};
</script>

<style scoped>
.profile-container {
  display: block;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  box-sizing: border-box;
}
.profile-content {
  width: 100%;
}

.profile-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;

  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details {
  flex: 1;
}

.logout-btn {
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
</style>
