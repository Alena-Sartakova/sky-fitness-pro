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
        const response = await $fetch('https://wedev-api.sky.pro/api/fitness/courses')

        if (!response) {
          throw new Error('Не удалось получить данные')
        }

        this.courses = response
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
        const response = await $fetch(`https://wedev-api.sky.pro/api/fitness/courses/${courseId}`)

        if (!response) {
          throw new Error('Курс не найден')
        }

        
        return response
      } catch (error) {
        console.error('Ошибка получения курса:', error)
        throw new Error(error.message || 'Ошибка при получении курса')
      }
    }
  },

  getters: {
    getAllCourses: (state) => state.courses,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  }
})
