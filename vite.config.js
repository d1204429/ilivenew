import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8080,
    // host: true,
    // cors: true,
    // proxy: {
    //   '/api/v1': {
    //     target: 'http://localhost:1988',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/v1/, ''),
    //   },
    // }
  },
  build: {
    sourcemap: true,
  }
})
