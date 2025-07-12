import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Enable environment variables with REACT_APP_ prefix
  define: {
    'import.meta.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
  },
});