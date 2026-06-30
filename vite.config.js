import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
// Help us keep track of what we import, and the size effect it has on the bundle
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'url'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // Cypress e2e local runs start Vite with --mode testing.
    // Keep Vue DevTools off in that mode to avoid test interference.
    mode !== 'testing' && vueDevTools(),
    visualizer(), // The docs recommend this one goes last
  ].filter(Boolean),
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
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        loginCallback: resolve(import.meta.dirname, 'login-callback.html'),
      },
    },
    outDir: 'dist/public',
  },
}))
