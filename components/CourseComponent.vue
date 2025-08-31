<template>
  <div class="course-card">
    <!-- Заголовок курса -->
    <h2 class="course-title">{{ course.nameRU }}</h2>

    <!-- Блок "Подойдет для вас, если" -->
    <div class="target-section">
      <h3 class="section-title">Подойдет для вас, если:</h3>
      <ul class="target-list">
        <li
          v-for="(direction, index) in course.directions"
          :key="index"
          class="target-item"
        >
          {{ direction }}
        </li>
      </ul>
    </div>

    <!-- Блок "Направления" -->
    <div class="directions-section">
      <h3 class="section-title">Направления:</h3>
      <ul class="directions-list">
        <li
          v-for="(fit, index) in course.fitting"
          :key="index"
          class="direction-item"
        >
          {{ fit }}
        </li>
      </ul>
    </div>

    <!-- Статичный блок преимуществ -->
    <div class="benefits-section">
      <h3 class="section-title">Начните путь к новому телу:</h3>
      <ul class="benefits-list">
        <li class="benefit-item">Проработка всех групп мышц</li>
        <li class="benefit-item">Тренировка суставов</li>
        <li class="benefit-item">Улучшение циркуляции крови</li>
        <li class="benefit-item">Упражнения заряжают бодростью</li>
        <li class="benefit-item">Помогают противостоять стрессам</li>
      </ul>
    </div>

    <!-- Кнопка авторизации -->
    <button class="auth-button" @click="handleAuthRedirect">
      Войдите, чтобы добавить курс
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
    validator: (c) => {
      return ["nameRU", "directions", "fitting"].every((f) => f in c);
    },
  },
});

const router = useRouter();
const route = useRoute();

const handleAuthRedirect = () => {
  // Сохраняем текущий путь для редиректа после авторизации
  const redirectPath = route.fullPath;

  router.push({
    path: "/auth",
    query: { redirect: redirectPath },
  });
};
</script>

<style lang="scss" scoped>
.course-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.course-title {
  color: #1e40af;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.section-title {
  color: #374151;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
}

.target-list,
.directions-list,
.benefits-list {
  list-style: none;
  padding-left: 1.5rem;
}

.target-list li,
.directions-list li,
.benefits-list li {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.benefits-section {
  background: #f0f4ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.benefit-item {
  color: #4b5563;
  font-weight: 500;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: background 0.3s ease;
}

.auth-button:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .course-card {
    padding: 1.5rem;
  }

  .course-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.1rem;
  }
}
</style>
