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
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
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
