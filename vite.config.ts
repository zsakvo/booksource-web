import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://api.shuyuansy.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style`
        }
      ]
    })
  ]
})
