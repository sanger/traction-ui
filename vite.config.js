import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// Help us keep track of what we import, and the size effect it has on the bundle
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer(), // The docs recommend this one goes last
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
      '@support': fileURLToPath(new URL('./tests/support', import.meta.url)),
      // This is a dummy wrapper to ensure swrv continues to operate with vue 2.7
      // which includes the composition API directly. It can probably be removed when
      // swrv updates
      '@vue/composition-api': fileURLToPath(
        new URL('./src/lib/composition_wrapper', import.meta.url),
      ),
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
