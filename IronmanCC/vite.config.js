import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'common': fileURLToPath(new URL('./src/common', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url)),
      'json': fileURLToPath(new URL('./src/common/json', import.meta.url)),
  },
},
})
