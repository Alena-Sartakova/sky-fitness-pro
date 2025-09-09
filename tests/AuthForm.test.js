import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import AuthForm from '../components/AuthForm.vue'

// Мокаем хранилище
vi.mock('../stores/user', () => ({
  useUserStore: () => ({
    error: null,
    login: vi.fn(),
    register: vi.fn(),
    $reset: vi.fn()
  })
}))

const mockRouter = { push: vi.fn() }
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('AuthForm - Базовые тесты', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Кнопка отправки разблокируется при заполнении полей', async () => {
    const wrapper = mount(AuthForm, {
      props: { isLogin: true }
    })

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="Пароль"]').setValue('password123')
    
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeUndefined()
  })

  it('Переключает режим формы по клику', async () => {
    const wrapper = mount(AuthForm, {
      props: { 
        isLogin: true,
        isModal: true // Включаем режим модального окна
      },
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })
  
    const toggleButton = wrapper.find('button.toggle-button')
    await toggleButton.trigger('click')
    
    // Проверяем что событие было вызвано с правильными аргументами
    expect(wrapper.emitted()).toHaveProperty('toggle-mode')
    expect(wrapper.emitted('toggle-mode')).toHaveLength(1)
  })
})