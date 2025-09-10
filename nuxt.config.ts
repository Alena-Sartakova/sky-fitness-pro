// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // Добавляем необходимые настройки для деплоя
  app: {
    baseURL: '/sky-fitness-pro/', // Если репозиторий не в организации
    // или '/', если репозиторий в организации
  },
  ssr: true, 

  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:3000'
    }
  },

  imports: {
    dirs: ['stores']
  }
})
