import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // for netlify
  // base: '/DarkSpaceBG/', for git hub pages
  plugins: [react()],
})