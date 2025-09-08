<template>
    <div class="success-overlay" @click.self="$emit('close')">
    <div class="success-content">
      <div class="checkmark">✓</div>
      <h3 class="success-title">Прогресс сохранен!</h3>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.success-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.checkmark {
  font-size: 3rem;
  color: #48bb78;
  margin-bottom: 1rem;
}

.success-title {
  color: #2d3748;
  font-size: 1.25rem;
}
</style>