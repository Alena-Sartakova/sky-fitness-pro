// stores/workouts.js
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/user'

export const useWorkoutsStore = defineStore('workouts', {
  state: () => ({
    currentWorkout: null,
    courseProgress: {},
    workoutProgress: {},
    workoutsCompleted: {},
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchWorkout(workoutId) {
        
        try {
          this.isLoading = true
          const userStore = useUserStore()
          
          
          const response = await $fetch(`https://wedev-api.sky.pro/api/fitness/workouts/${workoutId}`, {
            headers: {
              Authorization: `Bearer ${userStore.token}`
            }
          })
          
          
          this.currentWorkout = response
          return response
        } catch (error) {
          
          this.error = this.handleError(error)
          throw error
        } finally {
          this.isLoading = false
          
        }
      },
  

      async fetchCourseProgress(courseId) {
        try {
        const userStore = useUserStore();
        
        try {
        const response = await $fetch(`https://wedev-api.sky.pro/api/fitness/users/me/progress`, {
        params: { courseId },
        headers: {
        Authorization: `Bearer ${userStore.token}`
        }
        });
        
        // Проверяем, что response содержит нужные данные
        if (response && response.workoutsProgress) {
        this.courseProgress = {
        [courseId]: response
        };
        
        // Обновляем статусы завершённых тренировок только если есть данные
        response.workoutsProgress.forEach(workoutProgress => {
        this.workoutsCompleted[workoutProgress.workoutId] = workoutProgress.workoutCompleted;
        });
        } else {
        // Если прогресса нет, инициализируем пустые данные
        this.courseProgress = {
        [courseId]: {
        workoutsProgress: []
        }
        };
        }
        
        } catch (apiError) {
        // Если API вернул ошибку 404 (прогресс не найден)
        if (apiError.response && apiError.response.status === 404) {
        console.log('Прогресс для курса не найден, инициализируем пустые данные');
        this.courseProgress = {
        [courseId]: {
        workoutsProgress: []
        }
        };
        } else {
        throw apiError;
        }
        }
        
        } catch (error) {
        this.error = this.handleError(error);
        throw error;
        }
       },

    async fetchWorkoutProgress(courseId, workoutId) {
      try {
        const userStore = useUserStore()
        
        this.workoutProgress[workoutId] = await $fetch(`https://wedev-api.sky.pro/api/fitness/users/me/progress`, {
          params: { courseId, workoutId },
          headers: {
            Authorization: `Bearer ${userStore.token}`
          }
        })
      } catch (error) {
        this.error = this.handleError(error)
        throw error
      }
    },

    async saveWorkoutProgress(courseId, workoutId, progressData) {
      try {
        const userStore = useUserStore()
        
        const updatedProgress = await $fetch(
          `https://wedev-api.sky.pro/api/fitness/courses/${courseId}/workouts/${workoutId}`,
          {
            method: 'PATCH',
            body: { progressData },
            headers: {
              Authorization: `Bearer ${userStore.token}`,
              'Content-Type': ''
            }
          }
        )

        this.workoutProgress[workoutId] = {
          ...this.workoutProgress[workoutId],
          ...updatedProgress,
          progressData: updatedProgress.progressData
        }
        
        return updatedProgress
      } catch (error) {
        this.error = this.handleError(error)
        throw error
      }
    },

    async resetWorkoutProgress(courseId, workoutId) {
      try {
        const userStore = useUserStore()
        
        await $fetch(
          `https://wedev-api.sky.pro/api/fitness/courses/${courseId}/workouts/${workoutId}/reset`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${userStore.token}`
            }
          }
        )

        if (this.workoutProgress[workoutId]) {
          this.workoutProgress[workoutId] = {
            workoutId,
            workoutCompleted: false,
            progressData: new Array(
              this.workoutProgress[workoutId].progressData.length
            ).fill(0)
          }
        }
      } catch (error) {
        this.error = this.handleError(error)
        throw error
      }
    },

    handleError(error) {
      if (error.data?.message) return error.data.message
      if (error.status === 401) return 'Требуется авторизация'
      return 'Произошла ошибка при выполнении запроса'
    },

    isWorkoutCompleted(workoutId) {
      return this.workoutProgress[workoutId]?.workoutCompleted || false
    },

    getExerciseProgress(workoutId, exerciseIndex) {
      return this.workoutProgress[workoutId]?.progressData[exerciseIndex] || 0
    }
  },

  getters: {
    exercises: (state) => state.currentWorkout?.exercises || [],
    getCourseProgress: (state) => (courseId) => state.courseProgress[courseId] || {},
    getWorkoutCompletedStatus: (state) => (workoutId) => {
      // Добавляем проверку существования workoutId
      return state.workoutsCompleted[workoutId] ?? false;
    },
  }
})
