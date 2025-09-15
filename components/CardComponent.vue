<template>
  <NuxtLink :to="`/course/${course._id}`" class="card">
    <div class="card-image">
      <img
        :src="courseImage"
        :alt="course.nameRU"
        class="course-image"
        @error="handleImageError"
      />
      <button
        class="add-button"
        :class="{ added: isLocalAdded || isAdded }"
        @click.prevent="handleAdd"
      >
        <span class="add-icon">{{ isLocalAdded || isAdded ? "-" : "+" }}</span>
      </button>
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ course.nameRU }}</h3>

      <div class="meta-container">
        <div class="meta-item">
          <img src="../assets/img/icon/Calendar.svg" class="icon" />
          <span class="meta-text"
            >{{ course.durationInDays }} {{ daysText }}</span
          >
        </div>

        <div class="meta-item">
          <img src="../assets/img/icon/Clock.svg" class="icon" />
          <span class="meta-text">
            {{ course.dailyDurationInMinutes.from }}-{{
              course.dailyDurationInMinutes.to
            }}
            мин
          </span>
        </div>

        <div class="meta-item difficulty">
          <img src="../assets/img/icon/Difficulty.svg" class="icon" />
          <span class="meta-text">{{ formattedDifficulty }}</span>
        </div>
        <!-- Место для прогресс бара -->

        <div v-if="props.isProfilePage" class="progress-container">
          <span class="progress-text">
            <template v-if="isProgressLoading">
              Загрузка прогресса...
            </template>
            <template v-else-if="!courseId"> ID курса не определен </template>
            <template v-else>
              Прогресс: {{ progressData.percentage }}%
            </template>
          </span>
          <div
            class="progress-bar"
            :style="{ width: `${progressData.percentage}%` }"
          ></div>
        </div>
      </div>
      <button
        v-if="showTrainingButton"
        class="train-button"
        @click="handleStartTraining"
      >
        {{ trainingButtonText }}
      </button>
    </div>
  </NuxtLink>
  <WorkoutModal
    v-if="showWorkoutModal"
    :course-id="course._id"
    :sorted-workouts="sortedWorkouts"
    @close="closeWorkoutModal"
  />
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useCoursesStore } from "../stores/courses";
import { useUserStore } from "../stores/user";
import { useWorkoutsStore } from "../stores/workouts";

const isLocalAdded = ref(false);
const userStore = useUserStore();
const coursesStore = useCoursesStore();
const workoutsStore = useWorkoutsStore();
const showWorkoutModal = ref(false);
const sortedWorkouts = ref();
const isProgressLoading = ref(false);
const isStoreReady = ref(false)
const isDataLoaded = ref(false)

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  isProfilePage: {
    type: Boolean,
    default: false,
    customValidator: (value) => {
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      return typeof value === "boolean";
    },
  },

});

const progressData = ref({
  completed: 0,
  total: 0,
  percentage: 0,
});

const userCourses = computed(() => {
  return userStore.currentUser?.user?.selectedCourses || [];
});

const isAdded = computed(() => {
  return userCourses.value.includes(props.course._id);
});

const handleAdd = async (e) => {
  e.stopPropagation();
  try {
    if (isLocalAdded.value || isAdded.value) {
      isLocalAdded.value = false;
      await coursesStore.removeCourse(props.course._id);
    } else {
      isLocalAdded.value = true;
      await coursesStore.addCourse(props.course._id);
    }

    const isCourseAdded = coursesStore.getUserCourses.includes(
      props.course._id
    );
    if (isCourseAdded !== (isLocalAdded.value || isAdded.value)) {
      isLocalAdded.value = isCourseAdded;
    }
  } catch (error) {
    isLocalAdded.value = !isLocalAdded.value;
    console.error("Ошибка при изменении статуса курса:", error);
  }
};

watch(
  () => coursesStore.getUserCourses,
  () => {
    isLocalAdded.value = coursesStore.getUserCourses.includes(props.course._id);
  }
);

const formattedDifficulty = computed(() => {
  return (
    props.course.difficulty.charAt(0).toUpperCase() +
    props.course.difficulty.slice(1)
  );
});

const handleImageError = (e) => {
  e.target.src = defaultImage.value;
  e.target.classList.add("image-error");
};

const defaultImage = computed(
  () => new URL("../assets/img/main/default-course.png", import.meta.url).href
);

const courseImage = computed(() => {
  try {
    const imagePath = new URL(
      `../assets/img/main/${props.course.nameEN}.png`,
      import.meta.url
    ).href;
    return imagePath;
  } catch (error) {
    console.error("Error loading course image:", error);
    return defaultImage.value;
  }
});

const daysText = computed(() => {
  const days = props.course.durationInDays;
  const lastDigit = days % 10;
  if (days >= 11 && days <= 14) return "дней";
  if (lastDigit === 1) return "день";
  if (lastDigit >= 2 && lastDigit <= 4) return "дня";
  return "дней";
});

const showTrainingButton = computed(() => {
  return props.isProfilePage && props.course._id;
});

// Вычисляемое свойство для текста кнопки
const trainingButtonText = computed(() => {
  if (progressData.value.percentage === 0) return "Начать тренировку";
  return progressData.value.percentage < 100
    ? "Продолжить тренировку"
    : "Начать заново";
});

const extractWorkoutNumber = (name) => {
  const match = name.match(/(урок|день|lesson|day)\s*(\d+)/i);
  return match ? parseInt(match[2], 10) : null;
};

// Функция сортировки тренировок
const sortWorkouts = (workouts) => {
  return [...workouts].sort((a, b) => {
    const numA = extractWorkoutNumber(a.name);
    const numB = extractWorkoutNumber(b.name);

    if (numA !== null && numB !== null) return numA - numB;
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return 0;
  });
};

// Обработчик клика по кнопке
const handleStartTraining = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("Выбран курс:", {
    id: props.course._id,
    name: props.course.name,
    difficulty: props.course.difficulty,
    duration: props.course.durationInDays,
  });
  try {
    // Получаем и сортируем тренировки
    const rawWorkouts = await coursesStore.fetchCourseWorkouts(
      props.course._id
    );
    sortedWorkouts.value = sortWorkouts(rawWorkouts);
    showWorkoutModal.value = true;
  } catch (error) {
    console.error("Ошибка при получении тренировок:", error);
    // Можно добавить уведомление об ошибке
  }
};

const closeWorkoutModal = () => {
  showWorkoutModal.value = false;
};

const courseId = computed(() => props.course._id);

// Ждем инициализации хранилища
watch(
  () => workoutsStore.isInitialized,
  async (newValue) => {
    if (newValue) {
      isStoreReady.value = true
      await handleInitialization()
    }
  },
  { immediate: true }
)

async function handleInitialization() {
  if (props.isProfilePage && courseId.value && isStoreReady.value) {
    try {
      isProgressLoading.value = true

      // Сначала проверяем наличие прогресса
      if (!workoutsStore.courseProgress[courseId.value]) {
        console.log('Начинаем загрузку прогресса')
        await workoutsStore.fetchCourseProgress(courseId.value)
      }

      // Затем загружаем тренировки курса
      await coursesStore.fetchCourseWorkouts(courseId.value)

      await nextTick()

      // Проверяем успешность загрузки
      if (!workoutsStore.courseProgress[courseId.value]) {
        console.warn('Данные прогресса не загрузились')
        isProgressLoading.value = false
        return
      }

      // Обновляем прогресс
      await updateProgress()
      isProgressLoading.value = false
      isDataLoaded.value = true

      // Дополнительная проверка через таймаут
      setTimeout(() => {
        if (!progressData.value.percentage) {
          console.warn('Прогресс не обновился автоматически')
          updateProgress()
        }
      }, 500)
    } catch (error) {
      console.error('Ошибка инициализации:', error)
      isProgressLoading.value = false
    }
  }
}

// В секции onMounted оставляем только инициализацию хранилища
onMounted(async () => {
  try {
    // Инициализируем хранилище
    await workoutsStore.initialize()
  } catch (error) {
    console.error('Ошибка инициализации хранилища:', error)
  }
})
 
// Функция обновления прогресса
const updateProgress = async () => {
  try {
    const storeData = workoutsStore.courseProgress[courseId.value];
    
    console.log('Данные прогресса:', storeData);
    
    if (!storeData || !storeData.workoutsProgress) {
      console.warn('Данные прогресса отсутствуют');
      progressData.value = { completed: 0, total: 0, percentage: 0 };
      return;
    }

    // Логируем каждую тренировку
    storeData.workoutsProgress.forEach((wp, index) => {
      console.log(`Тренировка ${index + 1}:`, wp);
      console.log('workoutCompleted:', wp.workoutCompleted);
      console.log('progressData:', wp.progressData);
    });

    // Исправляем логику подсчета completed
    const validCompleted = storeData.workoutsProgress.filter(wp => {
      return wp.workoutCompleted || 
        (wp.progressData && wp.progressData.every(v => v > 0)); // Проверяем, что все значения больше 0
    }).length;

    progressData.value = {
      completed: validCompleted,
      total: storeData.totalWorkouts,
      percentage: storeData.totalWorkouts > 0 
        ? Math.min(100, Math.round((validCompleted / storeData.totalWorkouts) * 100))
        : 0
    };
 
  console.log('Обновлённый прогресс:', progressData.value);
  } catch (error) {
  console.error('Ошибка обновления прогресса:', error);
  }
 }


</script>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
  color: #333;
}

.card {
  max-width: 360px;
  max-height: 649px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
}

.card-image {
  position: relative;
  height: 320px;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.add-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.card-content {
  max-width: 300px;
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: 0 8px 8px;
}

.card-title {
  font-size: 32px;
  margin: 0 0 12px 0;
  color: #1a2938;
  line-height: 1.3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-bottom: 20px;
}

.meta-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: auto;

  .progress-container {
    grid-column: span 3;
    padding: 8px;
  }
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f7f7f7;
  border-radius: 24px;
  padding: 8px 12px;
  font-size: 16px;
  max-width: 100%;
}

.meta-item.difficulty {
  grid-column: span 3;
  justify-content: center;
  padding: 8px;
}

.meta-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  font-size: 16px;
}

.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  object-fit: contain;
}

@media (max-width: 400px) {
  .card-image {
    height: 300px;
  }

  .card-title {
    font-size: 18px;
    -webkit-line-clamp: 3;
  }
}

.train-button {
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #bcec30;
  margin-top: auto;

  &:hover {
    background-color: #000000;
    color: #ffffff;
  }
}

.progress-container {
  margin-top: 16px;
  width: 100%;
  margin-bottom: 32px;
}

.progress-bar {
  height: 8px;
  background: #00c1ff;
  border-radius: 8px;
  width: 0;
  max-width: 100%;
}

.progress-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}
</style>
