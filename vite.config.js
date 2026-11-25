import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Change this to a valid IP address if needed
    port: 3003, // Optional otherwise your app will start on default port
  },
  preview: {
    host: '0.0.0.0',
    port: 3003
  }
})
