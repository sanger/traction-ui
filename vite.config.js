import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@tests': path.resolve('./tests'),
      '@support': path.resolve('./tests/support'),
      // This is a dummy wrapper to ensure swrv continues to operate with vue 2.7
      // which includes the composition API directly. It can probably be removed when
      // swrv updates
      '@vue/composition-api': path.resolve('./src/lib/composition_wrapper'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/support/setup',
  },
  build: {
    outDir: 'dist/public',
  },
})
