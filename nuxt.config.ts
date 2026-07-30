export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || ''
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'MERED Broker Kit',
      titleTemplate: '%s',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' }
      ],
      meta: [
        {
          name: 'description',
          content: 'Official marketing materials and sales tools for MERED real estate projects.'
        },
        { name: 'author', content: 'MERED' },
        { name: 'theme-color', content: '#252828' },
        { property: 'og:site_name', content: 'MERED Broker Kit' },
        { property: 'og:locale', content: 'en_US' }
      ]
    }
  }
})
