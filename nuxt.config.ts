export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },
  app: {
    head: {
      title: 'MERED | Broker Kit',
      meta: [
        {
          name: 'description',
          content: 'Marketing materials and sales tools for MERED projects.'
        }
      ]
    }
  }
})
