<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal">
      <h2 class="modal-title">Введите прогресс</h2>

      <div class="exercises-list">
        <div
          v-for="exercise in exercises"
          :key="exercise._id"
          class="exercise-item"
        >
          <label class="exercise-label">{{ exercise.name }}</label>
          <input
            v-model.number="progressValues[exercise._id]"
            type="number"
            min="0"
            class="exercise-input"
            placeholder="0"
          />
        </div>
      </div>

      <div class="modal-actions">
        <button
          class="save-button"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
          @click="handleSubmit"
        >
          <span v-if="!isLoading">Сохранить</span>
          <LoaderIcon v-else class="loader" />
        </button>
      </div>
    </div>
  </div>

  <SuccessModal v-if="showSuccess" @close="showSuccess = false" />
</template>

<script setup>
const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
  workoutId: {
    type: String,
    required: true,
  },
  exercises: {
    type: Array,
    default: () => [],
  },
  isOpen: {
    // Добавлен пропс isOpen
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "success"]);
const workoutsStore = useWorkoutsStore();
const { $toast } = useNuxtApp();
const progressValues = ref({});
const isLoading = ref(false);
const showSuccess = ref(false);

// Инициализация значений
watch(
  () => props.exercises,
  (newExercises) => {
    progressValues.value = newExercises.reduce((acc, exercise) => {
      acc[exercise._id] = exercise.currentProgress || 0;
      return acc;
    }, {});
  },
  { immediate: true }
);

const handleClose = () => {
  if (!isLoading.value) {
    emit("close");
  }
};

onMounted(() => {
  if (!props.courseId || !props.workoutId) {
    console.error("Critical Error: Missing required IDs!", props);
    throw new Error("Компоненту не переданы обязательные параметры");
  }
});


const handleSubmit = async () => {
    try {
      // Собираем данные прогресса
      const progressData = props.exercises.map((exercise) => {
        const enteredValue = Number(progressValues.value[exercise._id]);
        const target = exercise.target || 0;
  
        // Проверяем, не превышает ли введённое значение целевое
        if (enteredValue > target) {
          throw new Error(`Нельзя ввести больше ${target} повторений для упражнения "${exercise.name}"`);
        }
        
        return enteredValue;
      });
  
      // Проверяем, что все значения корректны
      if (progressData.some((value, index) => value > props.exercises[index].target)) {
        throw new Error('Введены некорректные значения повторений');
      }
  
      // Отправляем данные
      await workoutsStore.saveWorkoutProgress(
        props.courseId,
        props.workoutId,
        progressData
      );
  
      showSuccess.value = true;
      emit('success');
    } catch (error) {
      console.error('Ошибка валидации:', error.message);
      $toast.error(error.message);
    }
  };

watchEffect(() => {
  console.log("Modal props:", {
    isOpen: props.isOpen,
    courseId: props.courseId,
    workoutId: props.workoutId,
    exercises: props.exercises,
  });
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  font-size: 1.5rem;
}

.exercises-list {
  margin-bottom: 2rem;
}

.exercise-item {
  margin-bottom: 1rem;
}

.exercise-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.exercise-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background: #4299e1;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3182ce;
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }

  &.loading {
    padding: 0.75rem 2rem;
  }
}

.loader {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
