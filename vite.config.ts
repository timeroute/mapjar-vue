import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'MapjarVue',
      fileName: 'mapjar-vue',
    },
    rollupOptions: {
      external: ['vue', 'mapjar'],
      output: {
        globals: {
          vue: 'Vue',
          mapjar: 'mapjar'
        }
      }
    }
  },
})
