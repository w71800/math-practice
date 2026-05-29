import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { PracticePage } from './pages/PracticePage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice/:slug" element={<PracticePage />} />
      </Routes>
    </BrowserRouter>
  )
}
