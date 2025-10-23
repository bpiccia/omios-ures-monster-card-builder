import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/ - Embeddable library build
export default defineConfig({
  plugins: [
    react(),
    // Inline CSS plugin for IIFE builds
    {
      name: 'inline-css',
      generateBundle(options, bundle) {
        const cssFiles = Object.keys(bundle).filter(fileName => fileName.indexOf('.css') > -1);
        const jsFiles = Object.keys(bundle).filter(fileName => fileName.indexOf('.js') > -1);
        
        if (cssFiles.length > 0 && jsFiles.length > 0) {
          const cssFile = bundle[cssFiles[0]] as any;
          const jsFile = bundle[jsFiles[0]] as any;
          
          if (cssFile && jsFile && cssFile.source) {
            // Inject CSS into JS
            const cssContent = cssFile.source.toString();
            const cssInjection = `
(function() {
  var style = document.createElement('style');
  style.textContent = ${JSON.stringify(cssContent)};
  document.head.appendChild(style);
})();
`;
            jsFile.code = cssInjection + jsFile.code;
            
            // Remove the CSS file from the bundle
            delete bundle[cssFiles[0]];
          }
        }
      }
    }
  ],
  publicDir: false, // Don't copy public files to avoid conflicts
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    emptyOutDir: false, // Don't clear the dist folder
    cssCodeSplit: false, // Bundle CSS with JS
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
