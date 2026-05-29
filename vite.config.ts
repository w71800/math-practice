import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 專案站：設為 /儲存庫名稱/（結尾要有 /）
// 本機開發或未指定時用 /
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
})
