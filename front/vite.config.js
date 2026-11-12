import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import projectsHandler from './api/projects.js'

// In dev, Vite does not know Vercel functions: the same handler is mounted on /api/projects.
function projectsApi() {
  return {
    name: 'projects-api',
    configureServer(server) {
      server.middlewares.use('/api/projects', projectsHandler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    projectsApi(),
  ],
})
