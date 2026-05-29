import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const indexPath = join('dist', 'index.html')

if (!existsSync(indexPath)) {
  console.error('copy-404: dist/index.html 不存在，請先執行 vite build')
  process.exit(1)
}

copyFileSync(indexPath, join('dist', '404.html'))
console.log('copy-404: 已建立 dist/404.html（GitHub Pages 子路徑路由用）')
