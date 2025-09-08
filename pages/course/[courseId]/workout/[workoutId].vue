<template>
  <div class="workout-container">
    <!-- Секция загрузки данных -->
    <div v-if="isLoading" class="loading">Загрузка...</div>

    <!-- Секция ошибок -->
    <div v-else-if="error" class="error-message">
      {{ error }}
      <button class="retry-btn" @click="retryLoading">Повторить попытку</button>
    </div>

    <!-- Основной контент -->
    <div v-else-if="workout && courseData" class="workout-content">
      <!-- Заголовок -->
      <div class="course-header">
        <h2 class="course-title">
          {{ courseData.nameRU || "Название курса" }}
        </h2>
      </div>

      <!-- Видео -->
      <div v-if="workout.video" class="video-wrapper">
        <iframe
          :src="workout.video"
          title="Видео тренировки"
          allowfullscreen
          class="video-player"
        />
      </div>

      <!-- Упражнения -->
      <div class="exercises-list">
        <h3 class="workout-title">{{ workout.name }}</h3>
        <div class="exercise-wrapper">
          <div
            v-for="(exercise, index) in workout.exercises"
            :key="exercise._id || index"
            class="exercise-card"
          >
            <h3 class="exercise-title">
              {{ exercise.name }} {{ getProgressPercentage(exercise) }}%
            </h3>

            <div class="progress-section">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: getProgressPercentage(exercise) + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- Кнопки действий -->
        <div class="action-buttons">
          <button
            :class="['progress-btn', { 'partial-progress': isPartialProgress }]"
            @click="openModal"
          >
            {{ progressButtonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Сообщения об отсутствии данных -->
    <div v-else-if="!courseData" class="no-data">Курс не найден</div>

    <div v-else class="no-data">Тренировка не найдена</div>
    <ProgressModal
      :is-open="showProgressModal"
      :course-id="courseId"
      :workout-id="workout.id"
      :exercises="workout.exercises"
      @close="showProgressModal = false"
      @success="handleProgressSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useWorkoutsStore } from "@/stores/workouts";
import { useCoursesStore } from "@/stores/courses";
import { useUserStore } from "@/stores/user";
import ProgressModal from "~/components/ProgressModal.vue";

const route = useRoute();
const workoutsStore = useWorkoutsStore();
const coursesStore = useCoursesStore();
const userStore = useUserStore();

const workoutId = computed(() => route.params.workoutId);
const courseId = computed(() => route.params.courseId);

const isLoading = ref(true);
const error = ref(null);
const progress = ref([]);
const courseData = ref(null);
const showProgressModal = ref(false);

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
    if (!workoutId.value || !courseId.value) {
      throw new Error("Некорректные параметры URL");
    }

    const [workoutRes, courseRes] = await Promise.allSettled([
      workoutsStore.fetchWorkout(workoutId.value),
      coursesStore.getCourseById(courseId.value),
      workoutsStore.fetchWorkoutProgress(courseId.value, workoutId.value),
    ]);

    if (workoutRes.status === "rejected") {
      throw new Error(
        "Ошибка загрузки тренировки: " + workoutRes.reason.message
      );
    }

    if (courseRes.status === "rejected") {
      console.warn("Ошибка загрузки курса:", courseRes.reason);
      courseData.value = { nameRU: "Неизвестный курс" };
    } else {
      courseData.value = courseRes.value;
    }

    const workout = workoutsStore.currentWorkout;
    if (workout?.exercises) {
      progress.value =
        workoutsStore.workoutProgress[workoutId.value]?.progressData ||
        new Array(workout.exercises.length).fill(0);
    }
  } catch (err) {
    error.value = err.message;
    console.error("❌ Ошибка инициализации:", err);
  } finally {
    isLoading.value = false;
  }
});

const workout = computed(() => {
  const baseWorkout = workoutsStore.currentWorkout || {};
  return {
    id: baseWorkout.id || route.params.workoutId,
    exercises: baseWorkout.exercises || [],
    ...baseWorkout,
  };
});

const getProgressPercentage = (exercise) => {
  const index = workout.value.exercises?.indexOf(exercise) ?? -1;
  const current = index !== -1 ? progress.value?.[index] || 0 : 0;
  const quantity = exercise?.quantity || 100;

  return Math.min(Math.round((current / quantity) * 100), 100);
};

const progressButtonText = computed(() => {
  if (!progress.value?.length) return "Заполнить свой прогресс";

  const isAllZero = progress.value.every((v) => v === 0);
  const isAllCompleted = progress.value.every(
    (v, i) => v >= workout.value.exercises?.[i]?.quantity || 0
  );

  return isAllZero
    ? "Заполнить свой прогресс"
    : isAllCompleted
    ? "Прогресс завершён"
    : "Продолжить тренировку";
});

// Метод для открытия модального окна
const openModal = () => {
  if (!workout.value.id || typeof workout.value.id !== "string") {
    console.error("Invalid workout ID:", workout.value.id);
    return;
  }
  showProgressModal.value = true;
};

// Обработка успешного сохранения прогресса
const handleProgressSuccess = async () => {
  try {
    // Обновляем прогресс из хранилища
    await workoutsStore.fetchWorkoutProgress(courseId.value, workoutId.value);

    // Обновляем локальное состояние прогресса
    progress.value =
      workoutsStore.workoutProgress[workoutId.value]?.progressData || [];

    // Проверяем, что прогресс обновился
    if (!progress.value.length) {
      throw new Error("Прогресс не был обновлен");
    }

    console.log("Прогресс успешно обновлен:", progress.value);
  } catch (error) {
    console.error("Ошибка при обновлении прогресса:", error);
  }
};

// Добавляем watcher для отслеживания изменений прогресса в сторе
watch(
  () => workoutsStore.workoutProgress[workoutId.value],
  async (newProgress) => {
    if (newProgress) {
      progress.value = newProgress.progressData || [];
    }
  },
  { deep: true }
);
</script>

<style scoped>
.workout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-message {
  background: #ffe3e6;
  color: #dc3545;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.course-header {
  text-align: center;
  margin-bottom: 2rem;
}

.course-title {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: start;
}

.workout-title {
  color: #34495e;
  font-size: 1.5rem;
}

.video-wrapper {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-player {
  width: 100%;
  height: 500px;
  border: none;
}

.exercise-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
}

.exercises-list {
  margin: 3rem 0;
  display: grid;
  gap: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.exercise-card {
  background: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.exercise-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  flex: 1; 
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex-grow: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-top: auto; 
}

.progress-fill {
  height: 100%;
  background: #00C1FF;
  transition: width 0.3s ease;
}

.progress-text {
  color: #666;
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

.action-buttons {
  margin: 2rem;
}

.progress-btn {
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


.retry-btn {
  background: #dc3545;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 10px;
}

.no-data {
  padding: 3rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .video-player {
    height: 300px;
  }

  .exercise-card {
    padding: 1rem;
  }

  .progress-section {
    flex-direction: column;
    align-items: stretch;
  }

  .progress-text {
    text-align: center;
  }
}
</style>
