<template>
    <div v-if="props.showModal" class="modal-overlay" @click="handleClose">
      <div class="modal-content" @click.stop>
        <AuthForm
          :is-modal="true"
          :is-visible="true"
          :is-login="isLogin"
          @close="handleClose"
          @toggle-mode="toggleMode"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    showModal: {
      type: Boolean,
      required: true,
      default: false
    }
  });

  
  const emit = defineEmits(['close']);
  
  const isLogin = ref(true);
  
  const handleClose = () => {
    emit('close');
  };
  
  const toggleMode = () => {
    isLogin.value = !isLogin.value;
  };
  </script>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-content {
    background-color: #fff;
    padding: 40px;
    border-radius: 16px;
    width: 100%;
    max-width: 360px;
    min-height: 425px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
</style>