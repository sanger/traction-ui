import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Help us keep track of what we import, and the size effect it has on the bundle
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'url'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    visualizer(), // The docs recommend this one goes last
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
      '@support': fileURLToPath(new URL('./tests/support', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/support/setup.js',
  },
  build: {
    outDir: 'dist/public',
  },
})
