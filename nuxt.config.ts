// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-09-12',
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

  app: {
    baseURL: '/sky-fitness-pro/'
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
