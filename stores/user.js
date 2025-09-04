import { defineStore } from 'pinia';

const getInitialToken = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('fitnessToken');
    }
    return null;
  };

  const getInitialUserData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('fitnessUser');
      return data ? JSON.parse(data) : null;
    }
    return null;
  };

export const useUserStore = defineStore('user', {
  state: () => ({
    
    userData: getInitialUserData(),
    token: getInitialToken(),
    isLoading: false,
    error: null
  }),
  actions: {
    async register(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await fetch('https://wedev-api.sky.pro/api/fitness/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': ''
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка регистрации');
        }

        console.log('Регистрация прошла успешно!');
        localStorage.setItem('fitnessToken', data.token);
        this.token = data.token;
        await this.fetchUserData();
        
      } catch (error) {
        this.error = this.mapErrorMessage(error.message);
        console.error('Ошибка регистрации:', error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async login(email, password) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch('https://wedev-api.sky.pro/api/fitness/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': ''
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка авторизации');
        }

        console.log('Успешный вход!');
        localStorage.setItem('fitnessToken', data.token);
        this.token = data.token;
        await this.fetchUserData();

      } catch (error) {
        this.error = this.mapErrorMessage(error.message);
        console.error('Ошибка входа:', error.message);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUserData() {
      
      if (!this.token) return;

      try {
        const response = await fetch('https://wedev-api.sky.pro/api/fitness/users/me', {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('Ошибка получения данных пользователя');
        }

        this.userData = data;
        

      } catch (error) {
        console.error('Ошибка:', error.message);
        
      }
    },

    setToken(token) {
        this.token = token;
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('fitnessToken', token);
        }
      },

      logout() {
        this.userData = null;
        this.token = null;
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('fitnessToken');
        }
    },

    mapErrorMessage(message) {
      const messages = {
        'Введите корректный Email': 'invalid-email',
        'Пользователь с таким email уже существует': 'email-exists',
        'Пароль должен содержать не менее 6 символов': 'password-length',
        'Пароль должен содержать не менее 2 спецсимволов': 'password-special-chars',
        'Пароль должен содержать как минимум одну заглавную букву': 'password-uppercase',
        'Пользователь с таким email не найден': 'user-not-found',
        'Неверный пароль': 'wrong-password'
      };
      
      return messages[message] || 'unknown-error';
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.userData
  }
});
