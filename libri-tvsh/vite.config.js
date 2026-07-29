import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { readFileSync } from 'node:fs'

// Versioni mbahet vetëm te package.json dhe injektohet gjatë build-it,
// që të mos ketë nevojë të përditësohet në dy vende.
const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          bootstrap: ['react-bootstrap', 'bootstrap'],
          excel: ['exceljs', 'file-saver'],
          select: ['react-select'],
          fontawesome: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome',
          ],
        },
      },
    },
  },
})
