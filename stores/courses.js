// stores/courses.js
import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCourses() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await useFetch('https://wedev-api.sky.pro/api/fitness/courses')
        
        if (error.value) {
          throw new Error(error.value.message)
        }

        this.courses = data.value
        console.log('Полученные курсы:', this.courses)
      } catch (error) {
        this.error = error.message || 'Ошибка при получении курсов'
        console.error('Ошибка получения курсов:', error)
      } finally {
        this.loading = false
      }
    },

    async getCourseById(courseId) {
      try {
        const { data, error } = await useFetch(`https://wedev-api.sky.pro/api/fitness/courses/${courseId}`)
        
        if (error.value) {
          throw new Error(error.value.message)
        }

        console.log('Получен курс:', data.value)
        return data.value
      } catch (error) {
        console.error('Ошибка получения курса:', error)
        throw new Error(error.message || 'Ошибка при получении курса')
      }
    }
  },

  getters: {
    getAllCourses: (state) => state.courses,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error
  }
})
