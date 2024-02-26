import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    assetsInclude: ['**/*.jpg'],
    plugins: [react()],
    server: {
      port: Number(process.env.VITE_PORT)
    }
  })
}
// export default defineConfig(({ command, mode, ssrBuild }) => {
//   return {
//     assetsInclude: ['**/*.jpg'],
//     plugins: [react()],
//     server: {
//       port: 
//     }
//   }
// })