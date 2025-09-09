<template>
  <div
    v-show="isVisible"
    class="modal-overlay"
    @click.self="handleOverlayClick"
  >
    <div class="modal-content">
      <div class="logo">
        <img src="../assets/img/logo.svg" alt="Logo" />
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-input">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            :class="{ 'error-field': emailError }"
            @input="handleInput"
          />
          <input
            v-model="password"
            placeholder="Пароль"
            required
            :class="{ 'error-field': passwordError }"
            @input="handleInput"
          />
          <input
            v-if="!isLogin"
            v-model="confirmPassword"
            placeholder="Повторите пароль"
            required
            :class="{ 'error-field': confirmPasswordError }"
            @input="handleInput"
          />

          <div v-if="userStore.error" class="error-message">
            {{ errorMessage }}
          </div>

          <button
            v-if="password.length > 0"
            type="button"
            class="password-toggle"
          />
        </div>

        <div class="form-button">
          <button type="submit" class="login-button" :disabled="!isFormValid">
            {{ isLogin ? "Войти" : "Зарегистрироваться" }}
          </button>
          <button
            type="button"
            
            class="toggle-button"
            @click="handleModeToggle"
          >
            {{ isLogin ? "Зарегистрироваться" : "Войти" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";

const props = defineProps({
  isLogin: {
    type: Boolean,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
  isModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "toggle-mode"]);

const router = useRouter();
const userStore = useUserStore();


const email = ref("");
const password = ref('')
const confirmPassword = ref("");

// Реактивная валидация
const emailError = computed(() => !/^\S+@\S+\.\S+$/.test(email.value));
const passwordError = computed(() => password.value.length < 6);
const confirmPasswordError = computed(
  () => !props.isLogin && password.value !== confirmPassword.value
);

const isFormValid = computed(() => {
  if (props.isLogin) {
    return !emailError.value && !passwordError.value;
  }
  return (
    !emailError.value && !passwordError.value && !confirmPasswordError.value
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  try {
    userStore.$reset();
    const authMethod = props.isLogin ? userStore.login : userStore.register;
    await authMethod(email.value, password.value);

    if (userStore.token && !userStore.error) {
      if (props.isModal) {
        emit("close");
      } else {
        await router.push("/");
      }
      resetForm();
    }
  } catch (error) {
    console.error("Auth error:", error);
  }
};

const errorMessages = {
  "invalid-email": "Введите корректный Email",
  "email-exists": "Пользователь с таким email уже существует",
  "password-length": "Пароль должен содержать минимум 6 символов",
  "password-special-chars": "Добавьте минимум 2 спецсимвола (!@#$%^&*)",
  "password-uppercase": "Добавьте минимум одну заглавную букву",
  "user-not-found": "Пользователь не найден",
  "wrong-password": "Неверный пароль",
  "unknown-error": "Произошла ошибка. Попробуйте снова",
};

const errorMessage = computed(() => {
  return errorMessages[userStore.error] || errorMessages["unknown-error"];
});

const handleInput = () => {
  if (userStore.error) userStore.error = null;
};

const handleModeToggle = () => {
  if (props.isModal) {
    emit("toggle-mode");
  } else {
    router.push(props.isLogin ? "/regpage" : "/authpage");
  }
};

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget && props.isVisible) {
    emit("close");
  }
};

const resetForm = () => {
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
};

// Очистка ошибок при изменении данных
watch([email, password, confirmPassword], () => {
  if (userStore.error) userStore.error = null;
});
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
  z-index: 9999;
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
.toggle-button {
  width: 100%;
  height: 52px;
  padding: 10px;
  border-radius: 26px;
  font-size: 18px;
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

.toggle-button {
  background-color: transparent;
  border: 1px solid #000000;
  color: #000000;
}

.toggle-button:hover {
  background-color: #e9eced;
}

.error-message {
  color: #ff4444;
  text-align: center;
}
</style>
