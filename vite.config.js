import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/beijing-platformer/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        beijing: resolve(__dirname, 'beijing.html'),
      },
    },
  },
})
