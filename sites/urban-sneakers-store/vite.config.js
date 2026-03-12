import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// De editor plugin is alleen lokaal beschikbaar tijdens development
let athenaEditorPlugin = null;
const pluginPath = path.resolve(__dirname, '../../factory-engine/lib/vite-plugin-athena-editor.js');

if (fs.existsSync(pluginPath)) {
  const module = await import(`file://${pluginPath}`);
  athenaEditorPlugin = module.default;
}

export default defineConfig({
  base: '/urban-sneakers-store/', 
  plugins: [
    react(),
    tailwindcss(),
    athenaEditorPlugin ? athenaEditorPlugin() : null
  ].filter(Boolean),
})