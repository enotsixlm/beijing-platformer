import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

export default {
  base: '/beijing-platformer/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        racing: resolve(root, 'racing.html'),
      },
    },
  },
}
