import { config } from '@vue/test-utils'

// Глобальные настройки для Vue Test Utils
config.global.mocks = {
  $t: (msg) => msg // Пример мока для i18n
}