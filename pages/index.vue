<template>
<MainComponent />
</template>

<script setup>
import MainComponent from '~/components/MainComponent.vue';
import { useCoursesStore } from '~/stores/courses';

// Инициализируем хранилище
const coursesStore = useCoursesStore();

// Запускаем получение курсов
coursesStore.fetchCourses()
  .then(() => {
    console.log('Хранилище курсов успешно инициализировано');
    console.log('Данные о курсах:', coursesStore.courses);
  })
  .catch(error => {
    console.error('Ошибка при инициализации хранилища:', error);
  });
</script>

<style lang="scss" scoped>

</style>
