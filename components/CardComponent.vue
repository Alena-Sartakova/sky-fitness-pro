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
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { NuxtLink } from "#components";
import { computed, ref, watch } from "vue";
import { useCoursesStore } from '@/stores/courses'
import { useUserStore } from '@/stores/user'

const isLocalAdded = ref(false);
const userStore = useUserStore();
const coursesStore = useCoursesStore();

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
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
      // При удалении сбрасываем локальное состояние
      isLocalAdded.value = false;
      await coursesStore.removeCourse(props.course._id);
    } else {
      // При добавлении временно меняем состояние
      isLocalAdded.value = true;
      await coursesStore.addCourse(props.course._id);
    }
    
    // Проверяем успешность операции
    const isCourseAdded = coursesStore.getUserCourses.includes(props.course._id);
    if (isCourseAdded !== (isLocalAdded.value || isAdded.value)) {
      isLocalAdded.value = isCourseAdded;
    }
  } catch (error) {
    // Если произошла ошибка, возвращаем предыдущее состояние
    isLocalAdded.value = !isLocalAdded.value;
    console.error('Ошибка при изменении статуса курса:', error);
  }
};

watch(() => coursesStore.getUserCourses, () => {
  isLocalAdded.value = coursesStore.getUserCourses.includes(props.course._id);
});

const formattedDifficulty = computed(() => {
  return (
    props.course.difficulty.charAt(0).toUpperCase() +
    props.course.difficulty.slice(1)
  );
});

const handleImageError = (e) => {
  e.target.src = defaultImage.value;
  e.target.classList.add('image-error');
};

const defaultImage = computed(() => 
  new URL('../assets/img/main/default-course.png', import.meta.url).href
);

const courseImage = computed(() => {
  try {
    const imagePath = new URL(
      `../assets/img/main/${props.course.nameEN}.png`, 
      import.meta.url
    ).href;
    return imagePath;
  } catch (error) {
    console.error('Error loading course image:', error);
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
</script>

<style scoped>
.card {
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
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin: 0 8px 8px;
  height: calc(501px - 320px - 16px);
}

.card-title {
  font-size: 20px;
  margin: 0 0 12px 0;
  color: #1a2938;
  line-height: 1.3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
}

.meta-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f7f7f7;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
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
</style>
