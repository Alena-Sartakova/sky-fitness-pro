import { computed } from 'vue'
import { describe, it, expect } from 'vitest'

describe('userDisplayName computed property', () => {
  const testCases = [
    { 
      name: 'возвращает пустую строку при отсутствии пользователя',
      input: null,
      expected: ""
    },
    {
      name: 'корректно обрабатывает email с одной точкой',
      input: { user: { email: 'anna.petrova@example.com' } },
      expected: "anna petrova"
    },
    {
      name: 'удаляет все точки в имени пользователя',
      input: { user: { email: 'alexander.sidorov.1990@mail.ru' } },
      expected: "alexander sidorov 1990"
    },
    {
      name: 'работает с email без точек',
      input: { user: { email: 'testuser@domain.org' } },
      expected: "testuser"
    },
    {
      name: 'обрабатывает пустой email',
      input: { user: { email: '' } },
      expected: ""
    }
  ]

  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      // Создаем вычисляемое свойство
      const currentUser = computed(() => input)
      const userDisplayName = computed(() => {
        if (!currentUser.value?.user) return ""
        const emailParts = currentUser.value.user.email.split("@")
        return emailParts[0].replace(/\./g, " ")
      })
      
      expect(userDisplayName.value).toBe(expected)
    })
  })
})