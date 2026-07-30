import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes all built asset paths relative, so the build works
// on GitHub Pages regardless of the repository name (project pages are
// served from https://<user>.github.io/<repo>/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
