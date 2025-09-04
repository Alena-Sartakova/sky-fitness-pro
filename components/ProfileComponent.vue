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
            <img v-if="user.avatar" :src="user.avatar"  alt="Аватар" />
            <img v-else src="../assets/img/profile.png" />
          </div>
          
          <div class="details">
            <p><strong>Имя:</strong> {{ userDisplayName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
          </div>
        </div>
        
        <button class="logout-btn" @click="handleLogout">
          Выйти из системы
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '@/stores/user';
  import { computed, onMounted } from 'vue';
  
  const userStore = useUserStore();
  const isLoading = computed(() => userStore.isLoading);
  const user = computed(() => userStore.currentUser);
  

  onMounted(() => {
    if (!user.value && userStore.token) {
      userStore.fetchUserData();
    }
  });
  
  const handleLogout = () => {
    userStore.logout();
    // Переход на страницу входа (можно использовать navigateTo)
  };


  </script>
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .profile-info {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
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
    background: #ff6600;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #e65c00;
    }
  }
  </style>