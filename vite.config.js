import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4150,
    strictPort: true, // Optional: if true, Vite will exit if the port is already in use
    proxy: {
      "/users": "http://localhost:4000",
      "/events": "http://localhost:4000",
      "/mapRegion": "http://localhost:4000",
    },
  },
  define: {
    // Expose the port to your client-side code
    __APP_PORT__: 4150
  }
})

