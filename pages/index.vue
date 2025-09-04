<template>
  <div>
    <!-- Отображение состояния загрузки -->
    <div v-if="isInitializing" class="global-loader">
      <div class="loader"></div>
      <p>Инициализация приложения...</p>
    </div>

    <!-- Отображение ошибки инициализации -->
    <div v-else-if="initializationError" class="global-error">
      ⚠️ {{ initializationError }}
      <button @click="initializeStore">Попробовать снова</button>
    </div>

    <!-- Основной контент -->
    <MainComponent v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCoursesStore } from '~/stores/courses'
import MainComponent from '~/components/MainComponent.vue'

const coursesStore = useCoursesStore()
const isInitializing = ref(true)
const initializationError = ref(null)

const initializeStore = async () => {
  try {
    isInitializing.value = true
    initializationError.value = null
    
    // Проверяем необходимость загрузки данных
    if (coursesStore.shouldFetchCourses) {
      await coursesStore.fetchCourses()
    }
    
    /* console.log('Хранилище инициализировано:', coursesStore.courses) */
  } catch (error) {
    console.error('Ошибка инициализации:', error)
    initializationError.value = error.message || 'Ошибка загрузки начальных данных'
  } finally {
    isInitializing.value = false
  }
}

// Запускаем инициализацию при монтировании
onMounted(() => {
  initializeStore()
})
</script>

<style scoped>
.global-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.global-error {
  padding: 2rem;
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}

.global-error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.global-error button:hover {
  background: #dc2626;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
