import { UserConfigExport, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
const commonConfig: UserConfigExport = {
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
}
// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'build') {
    return {
      ...commonConfig,
      base: '/nest2/staff/'
    }
  } else {
    return {
      ...commonConfig,
      server:{
        port:5173
      }
    }
  }
})