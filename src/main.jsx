import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Logistics from './Logistics'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Logistics />
    </BrowserRouter>
  </StrictMode>,
)