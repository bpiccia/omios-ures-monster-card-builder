import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/ - Embeddable library build
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Include public files for assets
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    emptyOutDir: false, // Don't clear the dist folder
    lib: {
      entry: 'src/index-embed.ts',
      name: 'OmiosUriesCardMaker',
      fileName: () => 'omios-uries-card-maker.js',
      formats: ['iife']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
