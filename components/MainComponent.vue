<template>
  <div class="wrapper">
    <div class="text-container">
      <h2 class="main-title">
        Начните заниматься спортом <br />и улучшите качество жизни
      </h2>
    </div>
    <div class="image-container">
      <img
        src="../assets/img/Group 1597880551.png"
        alt="Измени свое тело за полгода"
      />
    </div>
  </div>

  <div class="content-container">
    <div v-if="coursesStore.isLoading" class="status-message">
      Загрузка курсов...
    </div>
    <div v-else-if="coursesStore.hasError" class="status-message error">
      {{ coursesStore.hasError }}
    </div>
    <div v-else class="cards-grid">
      <CardComponent
        v-for="course in coursesStore.getAllCourses"
        :key="course._id"
        :course="course"
      />
    </div>
  </div>
</template>

<script setup>
import CardComponent from "./CardComponent.vue";

const coursesStore = useCoursesStore();

onMounted(async () => {
  await coursesStore.fetchCourses();
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.text-container {
  flex: 1;
}

.main-title {
  font-size: 45px;
  line-height: 1.2;
  margin: 0;
}

.image-container {
  flex: 0 0 auto;
  max-width: 300px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.status-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #ff4444;
}

@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .main-title {
    font-size: 40px;
  }
}
</style>
