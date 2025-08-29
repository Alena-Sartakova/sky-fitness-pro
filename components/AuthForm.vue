<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="logo">
        <img src="../assets/img/logo.svg" alt="Logo" />
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-input">
          <!-- Общие поля -->
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            :class="{ 'error-field': emailError }"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Пароль"
            required
            :class="{ 'error-field': passwordError }"
          />

          <!-- Дополнительное поле для регистрации -->
          <input
            v-if="!isLogin"
            v-model="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            required
            :class="{ 'error-field': confirmPasswordError }"
          />
        </div>

        <div class="form-button">
          <!-- Основная кнопка действия -->
          <button type="submit" class="login-button" :disabled="!isFormValid">
            {{ isLogin ? "Войти" : "Зарегистрироваться" }}
          </button>

          <!-- Кнопка переключения формы -->
          <button
            type="button"
            class="register-button"
            @click="handleNavigation"
          >
            {{ isLogin ? "Зарегистрироваться" : "Войти" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  isLogin: {
    type: Boolean,
    required: true,
  },
});

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const emailError = ref(false);
const passwordError = ref(false);
const confirmPasswordError = ref(false);

// Валидация формы
const isFormValid = computed(() => {
  const emailValid = /^\S+@\S+\.\S+$/.test(email.value);
  const passwordValid = password.value.length >= 6;
  
  if (props.isLogin) {
    return emailValid && passwordValid;
  }
  
  return emailValid && passwordValid && (password.value === confirmPassword.value);
});


const handleSubmit = async () => {
  // Валидация полей
  emailError.value = !/^\S+@\S+\.\S+$/.test(email.value);
  passwordError.value = password.value.length < 6;

if (!props.isLogin) {
  confirmPasswordError.value = password.value !== confirmPassword.value;
}

if (emailError.value || passwordError.value || confirmPasswordError.value) {
  return;
}

  try {
    if (props.isLogin) {
      // Логика авторизации
    } else {
      // Логика регистрации
    }
  } catch {
    // Обработка ошибок
  }
};


</script>

<style scoped lang="scss">
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
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  min-height: 425px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    width: 90%;
    margin: 20px;
    padding: 30px;
    height: auto;
    min-height: 400px;
    max-height: 90vh;
  }
}

.logo {
  text-align: center;
  padding-bottom: 48px;

  @media (max-width: 480px) {
    padding-bottom: 32px;
    img {
      max-width: 200px;
    }
  }
}

form {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: 480px) {
    justify-content: flex-start;
  }
}

.form-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  width: 100%;
  height: 52px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;

  @media (max-width: 480px) {
    height: 48px;
  }
}

.form-button {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 34px;
  width: 100%;

  @media (max-width: 480px) {
    margin-top: 24px;
  }
}

.login-button,
.register-button {
  width: 100%;
  height: 52px;
  padding: 10px;
  border-radius: 26px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    background-color: #e9eced !important;
    color: #b0b0b0 !important;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    height: 48px;
  }
}

.login-button {
  background-color: #7ed321;
  color: #000000;
  border: none;
}

.login-button:hover {
  background-color: #000000;
  color: #ffffff;
}

.register-button {
  background-color: transparent;
  border: 1px solid #000000;
  color: #000000;
}

.register-button:hover {
  background-color: #e9eced;
}
</style>
