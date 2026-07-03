import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite: habilita el plugin de React (JSX, Fast Refresh)
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
