import 'reflect-metadata';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { ContainerProvider } from './hooks/useContainer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContainerProvider>
      <App />
    </ContainerProvider>
  </StrictMode>,
)
