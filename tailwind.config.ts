import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app.vue',
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}'
  ],
  theme: {
    screens: {
      md: '801px'
    },
    extend: {
      colors: {
        ink: '#171816',
        paper: '#f2f0ea',
        sand: '#d7c9b7',
        bronze: '#9b846a',
        charcoal: '#131514'
      },
      fontFamily: {
        sans: ['TT Commons Pro', 'Arial', 'sans-serif'],
        serif: ['ABC Helveesti', 'Arial', 'sans-serif']
      }
    }
  }
}
