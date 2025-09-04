<template>
    <div class="content-container">
      <div v-if="isLoading" class="status-message">
        Загрузка курсов...
      </div>
      <div v-else-if="hasError" class="status-message error">
        {{ hasError }}
      </div>
      <div v-else-if="!courses || courses.length === 0" class="status-message">
      Курсов пока нет
    </div>
      <div v-else class="cards-grid">
        <CardComponent
          v-for="course in courses"
          :key="course._id"
          :course="course"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    courses: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
        type: [String, Boolean],
      default: ''
    }
  });
  </script>

<style lang="scss" scoped>
.cards-grid {
display: flex;
flex-wrap: wrap;
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
</style>