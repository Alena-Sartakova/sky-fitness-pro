<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <h2>Выберите тренировку</h2>
      <button class="close-btn" @click="closeModal">×</button>

      <div class="workout-list">
        <div
        v-for="(workout, index) in workouts"
          :key="workout._id"
          class="workout-item"
          :class="{ 'disabled-item': !isWorkoutAvailable(index) }"
          @click="selectWorkout(workout, index)"
        >
          <div class="workout-header">
            <div class="progress-indicator">
              <span
                :class="{
                  'check-icon': isWorkoutCompleted(workout._id),
                  'circle-icon': !isWorkoutCompleted(workout._id),
                }"
              >
                {{ isWorkoutCompleted(workout._id) ? "✓" : "•" }}
              </span>
            </div>
            <div>
              <h3>{{ getWorkoutName(workout.name) }}</h3>
              <p class="workout-description">
                {{ getWorkoutDescription(workout.name) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        class="start-btn"
        
        @click="startTraining"
      >
        Начать тренировку
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCoursesStore } from "@/stores/courses";
import { useWorkoutsStore } from "@/stores/workouts";

const workoutsStore = useWorkoutsStore();

const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
  sortedWorkouts: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(["close"]);
const router = useRouter();
const coursesStore = useCoursesStore();
const isOpen = ref(true);
const selectedWorkout = ref(null);
const workouts = ref([]);
const course = ref(null);

// Добавляем вычисляемое свойство для проверки завершения тренировки
const isWorkoutCompleted = computed(() => {
  return (workoutId) => {
    if (!workoutId) return false;
    return workoutsStore.getWorkoutCompletedStatus(workoutId);
  };
});

const isWorkoutAvailable = computed(() => {
  return (workoutIndex) => {
  if (workoutIndex === 0) return true;
  
  const previousWorkout = workouts.value[workoutIndex - 1];
  if (!previousWorkout) return false;
  
  return workoutsStore.getWorkoutCompletedStatus(previousWorkout._id);
  };
 });
 

// Функция для извлечения номера из названия тренировки
const extractWorkoutNumber = (name) => {
  const match = name.match(/(урок|день|lesson|day)\s*(\d+)/i);
  return match ? parseInt(match[2], 10) : null;
};

// Функция сортировки тренировок
const sortWorkouts = (items) => {
  return [...items].sort((a, b) => {
    const numA = extractWorkoutNumber(a.name);
    const numB = extractWorkoutNumber(b.name);

    if (numA !== null && numB !== null) return numA - numB;
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return 0;
  });
};

onMounted(async () => {
  try {
    // Получаем информацию о курсе
    course.value = await coursesStore.getCourseById(props.courseId);

    // Получаем список тренировок
    if (props.sortedWorkouts) {
      workouts.value = props.sortedWorkouts;
    } else {
      const rawWorkouts = await coursesStore.fetchCourseWorkouts(props.courseId);
      workouts.value = sortWorkouts(rawWorkouts);
    }

    // Получаем прогресс курса (с обработкой отсутствия данных)
    try {
      await workoutsStore.fetchCourseProgress(props.courseId);
    } catch (progressError) {
      if (progressError.response && progressError.response.status === 404) {
        console.log('Прогресс курса не найден, продолжаем работу');
      } else {
        throw progressError;
      }
    }

    // Выводим информацию о курсе в консоль
    console.log("📋 Открыт курс:", {
      id: course.value._id,
      name: course.value.name,
      duration: course.value.durationInDays,
      difficulty: course.value.difficulty,
    });

  } catch (error) {
    console.error("Ошибка загрузки тренировок:", error);
  }
});
const getWorkoutName = (fullName) => {
  return fullName.split("/")[0].trim();
};

const getWorkoutDescription = (fullName) => {
  const parts = fullName.split("/");
  return parts.slice(1, 3).join("/").trim();
};

const selectWorkout = (workout) => {
  selectedWorkout.value = workout;
};

const startTraining = () => {
  if (!selectedWorkout.value?._id) {
    console.error("Workout ID is missing!");
    return;
  }

  emit("close");

  router.push({
    path: `/course/${props.courseId}/workout/${selectedWorkout.value._id}`,
    query: {
      courseName: course.value.name, 
      courseDifficulty: course.value.difficulty,
    },
  });
};
const closeModal = () => {
  isOpen.value = false;
  emit("close");
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.progress-indicator {
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  font-size: 18px;
}

.check-icon {
  color: #42b983;
  font-weight: bold;
}

.circle-icon {
  color: #ccc;
  font-size: 14px;
}

.workout-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workout-list {
  margin-top: 20px;
}

.workout-item {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &.disabled-item {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
    
    .progress-indicator {
      .circle-icon {
        color: #aaa;
      }
    }
    
    &:hover {
      background-color: transparent;
    }
  }
  
  &:hover:not(.disabled-item) {
    background-color: #f0f0f0;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.start-btn {
  width: 100%;
  max-width: 200px;
  padding: 12px;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #bcec30;

  &:hover:not(:disabled) {
    background-color: #000000;
    color: #ffffff;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}

.exercise-list {
  margin-top: 10px;
  padding-left: 20px;
  list-style-type: none;
}

.exercise {
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}
</style>
