import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import App from './App.tsx'
import { AppProvider } from "./pages/GlobalContext/AppContaxt.tsx";
createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AppProvider>
)
