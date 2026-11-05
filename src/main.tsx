import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SkillBridgeApp } from './application/SkillBridgeApp'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkillBridgeApp />
  </StrictMode>,
)
