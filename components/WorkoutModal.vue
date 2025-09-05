<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <h2>Выберите тренировку</h2>
      <button class="close-btn" @click="closeModal">×</button>

      <div class="workout-list">
        <div
          v-for="workout in workouts"
          :key="workout._id"
          class="workout-item"
          @click="selectWorkout(workout)"
        >
          <div class="workout-header">
            <h3>{{ getWorkoutName(workout.name) }}</h3>
            <p class="workout-description">
              {{ getWorkoutDescription(workout.name) }}
            </p>
          </div>
        </div>
      </div>

      <button
        class="start-btn"
        :disabled="!selectedWorkout"
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

const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
  // Добавляем опциональный пропс для предварительно отсортированных данных
  sortedWorkouts: {
    type: Array,
    default: null
  }
});

const emit = defineEmits(["close"]);

const coursesStore = useCoursesStore();
const isOpen = ref(true);
const selectedWorkout = ref(null);
const workouts = ref([]);

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
    if (props.sortedWorkouts) {
      // Используем предварительно отсортированные данные если они есть
      workouts.value = props.sortedWorkouts;
    } else {
      // Сортируем самостоятельно если данных нет
      const rawWorkouts = await coursesStore.fetchCourseWorkouts(props.courseId);
      workouts.value = sortWorkouts(rawWorkouts);
    }
    
  } catch (error) {
    console.error("Ошибка загрузки тренировок:", error);
  }
});

// Остальные методы без изменений
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
  if (selectedWorkout.value) {
    emit("close");
    // Здесь можно добавить переход к тренировке
    console.log("Starting workout:", selectedWorkout.value);
  }
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
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.workout-list {
  margin-top: 20px;
}

.workout-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f8f8f8;
  }
}

.workout-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.workout-description {
  color: #666;
  font-size: 14px;
}

.exercise-list {
  margin-top: 10px;
  padding-left: 20px;
}

.exercise {
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.start-btn {
  margin-top: 20px;
  padding: 15px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
}
</style>
