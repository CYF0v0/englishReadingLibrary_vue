import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mockDevServerPlugin(),
  ],
  resolve: {
    alias: {
        "@": resolve('src'), // 路径别名
    },
    extensions: ['.js', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  server: { 
    proxy: {
      '^/api': {
        target: 'http://example.com',
      },
    },
  }, 
})
