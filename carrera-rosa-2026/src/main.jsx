import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import Landing from './pages/Landing.jsx'
import Registration from './pages/Registration.jsx'
import Admin from './pages/Admin.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* reducedMotion="user" respeta el ajuste de accesibilidad del sistema operativo */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/registro" element={<Registration />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
