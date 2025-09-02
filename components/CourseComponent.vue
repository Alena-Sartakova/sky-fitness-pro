<template>
  <div class="course-card">
    <!-- Обертка для изображения -->
    <div class="course-image-wrapper">
      <img :src="courseImage" :alt="course.nameRU" class="course-main-image" />
      <h2 class="visually-hidden">{{ course.nameRU }}</h2>
    </div>

    <!-- Блок "Подойдет для вас, если" -->
    <div class="target-section">
      <h3 class="section-title">Подойдет для вас, если:</h3>
      <div class="target-list">
        <div
          v-for="(fit, index) in course.fitting"
          :key="index"
          class="target-item"
        >
          <span class="number">{{ index + 1 }}</span>
          <p class="fit-text">{{ fit }}</p>
        </div>
      </div>
    </div>

    <!-- Блок "Направления" -->
    <div class="directions-section">
      <h3 class="section-title">Направления:</h3>
      <div class="directions-wrapper">
        <ul class="directions-list">
          <li
            v-for="(direction, index) in course.directions"
            :key="index"
            class="direction-item"
          >
            <img src="../assets/img/icon/Star.svg" />
            {{ direction }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Статичный блок преимуществ -->
    <div class="benefits-section">
      <div class="content-wrapper">
        <h3 class="section-title">
          Начните путь<br />
          к новому телу:
        </h3>
        <ul class="benefits-list">
          <li class="benefit-item">Проработка всех групп мышц</li>
          <li class="benefit-item">Тренировка суставов</li>
          <li class="benefit-item">Улучшение циркуляции крови</li>
          <li class="benefit-item">Упражнения заряжают бодростью</li>
          <li class="benefit-item">Помогают противостоять стрессам</li>
        </ul>

        <!-- Кнопка авторизации -->
        <button class="auth-button" @click="handleAuthRedirect">
          Войдите, чтобы добавить курс
        </button>
      </div>

      <!-- Контейнер для изображений -->
      <div class="image-overlay">
        <img
          src="../assets/img/course/Mask-group.png"
          class="background-image"
        />
        <img
          src="../assets/img/course/Mask-group-1.png"
          class="foreground-image"
        />
      </div>
    </div>
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

const courseImage = computed(() => {
  return new URL(
    `../assets/img/course/${props.course.nameEN}.png`,
    import.meta.url
  ).href;
});

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
  padding: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.course-image-wrapper {
  position: relative;
  overflow: hidden;

  .course-main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.target-section,
.directions-section,
.benefits-section {
  padding-top: 2rem;
}

.section-title {
  color: #374151;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;

  &::before {
    display: none;
  }
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

.target-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
}

.target-item {
  background: #222;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex: 1 1 calc(33.33% - 1rem);
  min-width: 150px;
  width: calc(33.33% - 1rem);
  height: 100px;

  .fit-text {
    line-height: 1.4;
    word-break: break-word;
  }
}

.number {
  font-size: 4rem;
  margin-right: 1rem;
  color: #bcec30;
}

.directions-wrapper {
  background: #bcec30;
  border-radius: 12px;
  padding: 1rem;
}

.directions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
  list-style: none;
  width: 100%;
}

.direction-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;

  border-radius: 8px;
  flex: 1 1 calc(33.33% - 2rem);
}

.benefits-list {
  list-style: none;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.target-list li,
.directions-list li,
.benefits-list li {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.content-wrapper {
  width: 437px;
  margin-left: 2rem;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.benefits-section {
  position: relative;
  padding: 1.5rem;
  background: #f0f4ff;
  border-radius: 8px;
  margin: 1.5rem 0;
  overflow: visible;
  margin-top: 100px;
  z-index: 2;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-image {
  position: absolute;
  left: 0;
  width: 100%;
  height: 110%;
  z-index: 1;
}

.foreground-image {
  position: absolute;
  top: -20%;
  right: 5%;
  width: 40%;
  height: auto;
  -o-object-fit: contain;
  object-fit: contain;
  z-index: 3;
}

.auth-button {
  width: 100%;
  padding: 1rem;
  background: #bcec30;
  color: #000000;
  border: none;
  border-radius: 26px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: background 0.3s ease;
}

.auth-button:hover {
  background: #a8d52b;
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
