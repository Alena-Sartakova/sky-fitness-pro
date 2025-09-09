import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProgressModal from '../components/ProgressModal.vue'
import { createPinia, setActivePinia } from 'pinia'

// Мокаем зависимости
vi.mock('@/stores/workouts', () => ({
  useWorkoutsStore: () => ({
    saveWorkoutProgress: vi.fn(),
    $reset: vi.fn()
  })
}))

vi.mock('@/components/SuccessModal.vue', () => ({
  default: {
    template: '<div class="success-modal-mock"></div>'
  }
}))

const mockExercises = [
  { _id: '1', name: 'Приседания', quantity: 50, currentProgress: 30 },
  { _id: '2', name: 'Отжимания', quantity: 100, currentProgress: 0 }
]

describe('ProgressModal - Валидация полей ввода', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const createWrapper = () => mount(ProgressModal, {
    props: {
      isOpen: true,
      courseId: 'course-1',
      workoutId: 'workout-1',
      exercises: mockExercises
    }
  })

  it('Инициализирует значения полей из пропсов', () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input[type="text"]')
    expect(inputs[0].element.value).toBe('30')
    expect(inputs[1].element.value).toBe('0')
  })

  it('Блокирует нечисловые символы', async () => {
    const wrapper = createWrapper()
    const input = wrapper.findAll('input[type="text"]')[0]
    await input.setValue('abc!')
    expect(input.element.value).toBe('')
    expect(wrapper.vm.errors).toHaveProperty('1')
  })

  it('Показывает ошибку для дробных чисел', async () => {
    const wrapper = createWrapper()
    const input = wrapper.findAll('input[type="text"]')[0]
    
    // Попытка ввода дробного числа
    await input.setValue('12.5')
    await input.trigger('input')
    await wrapper.vm.$nextTick()
  
    // Проверяем, что значение было отфильтровано до '125'
    expect(input.element.value).toBe('125')
    
    // Проверяем ошибку диапазона
    expect(wrapper.vm.errors['1']).toContain('Допустимый диапазон: 0-50')
  })

  it('Валидирует максимальное значение', async () => {
    const wrapper = createWrapper()
    const input = wrapper.findAll('input[type="text"]')[0]
    await input.setValue('60')
    expect(wrapper.vm.errors['1']).toContain('Допустимый диапазон: 0-50')
  })

  it('Блокирует нечисловые символы', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input[type="text"]')
    
    // Эмулируем полный цикл ввода
    await input.setValue('abc!')
    await input.trigger('input') // Инициируем обработку события
    await wrapper.vm.$nextTick() // Ждём обновления DOM
    
    expect(input.element.value).toBe('') // Теперь значение должно быть пустым
    expect(wrapper.vm.errors).toHaveProperty('1')
  })
})
