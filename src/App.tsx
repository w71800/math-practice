import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { PracticePage } from './pages/PracticePage'

/** Vite base（GitHub Pages 為 /repo-name/） */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (base === '/') return undefined
  return base.replace(/\/$/, '')
}

export function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice/:slug" element={<PracticePage />} />
      </Routes>
    </BrowserRouter>
  )
}
