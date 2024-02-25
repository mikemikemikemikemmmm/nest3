import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'build') {
    return {
      base: '/nest2/client/',
      assetsInclude: ['**/*.jpg'],
      plugins: [react({
        babel: {
          plugins: [
            ["react-remove-properties", { "properties": ["data-testid"] }]
          ]
        }
      })],
    }
  } else {
    return {
      plugins: [react()],
      assetsInclude: ['**/*.jpg'],
      server:{
        port:5174
      }
    }
  }
})