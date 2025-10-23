import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 添加base配置，适配GitHub Pages部署
  // 假设你的仓库名称是abc，如果不是请修改为正确的仓库名
  base: '/abc/'
})