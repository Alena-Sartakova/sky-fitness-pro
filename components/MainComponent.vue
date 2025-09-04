<template>
  <div class="wrapper">
    <div class="text-container">
      <h2 class="main-title">
        Начните заниматься спортом <br >и улучшите качество жизни
      </h2>
    </div>
    <div class="image-container">
      <img
        src="../assets/img/Group 1597880551.png"
        alt="Измени свое тело за полгода"
      >
    </div>
  </div>

  <CardCaseComponent
      :courses="coursesStore.getAllCourses"
      :is-loading="coursesStore.isLoading"
      :has-error="coursesStore.hasError"
    />
</template>

<script setup>

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
