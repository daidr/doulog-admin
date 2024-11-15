import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
    }),
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
      ],
      dirs: ['./src/stores', './src/composables']
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3003,
    proxy: {
      '/api': {
        target: 'http://debug.daidr.dn11:3000',
        changeOrigin: true,
      },
      '/store': {
        target: 'http://debug.daidr.dn11:3000',
        changeOrigin: true,
      }
    }
  }
})
