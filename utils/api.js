import { useUserStore } from '@/stores/user'

const api = {
  async fetchWithAuth(url, options = {}) {
    const userStore = useUserStore()
    
    // Проверка наличия токена
    if (!userStore.token) {
      
      throw new Error('Требуется авторизация')
    }

    try {
      return await $fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${userStore.token}`,
          ...options.headers
        }
      })
    } catch (error) {
      // Обработка 401 ошибки
      if (error.status === 401) {
        
        throw new Error('Сессия истекла. Пожалуйста, войдите снова')
      }
      throw error
    }
  }
}

export default api
