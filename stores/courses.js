// stores/courses.js
import { defineStore } from 'pinia'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [], // Все доступные курсы
    userCourses: [], // Курсы, выбранные пользователем
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
      } catch (error) {
        this.error = error.message || 'Ошибка при получении курсов'
        console.error('Ошибка получения курсов:', error)
      } finally {
        this.loading = false
      }
    },

    async getCourseById(courseId) {
      try {
        const course = this.courses.find(c => c._id === courseId)
        if (!course) {
          throw new Error('Курс не найден')
        }
        return course
      } catch (error) {
        console.error('Ошибка получения курса:', error)
        throw new Error(error.message || 'Ошибка при получении курса')
      }
    },

    async fetchUserCourses(courseIds) {
      this.loading = true
      this.error = null
      try {
        const uniqueIds = [...new Set(courseIds)]
        const userCourses = uniqueIds.map(id => {
          const course = this.courses.find(c => c._id === id)
          return course
        }).filter(course => course !== undefined)
        this.userCourses = userCourses
        console.log(userCourses)
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке курсов'
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getAllCourses: (state) => state.courses,
    getUserCourses: (state) => state.userCourses,
    isLoading: (state) => state.loading,
    hasError: (state) => {
      if (state.error) {
        return state.error; // Возвращаем строку ошибки
      }
      return false; // Или null, если хотите
    }
  }
})
