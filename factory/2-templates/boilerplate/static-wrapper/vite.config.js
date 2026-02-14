import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// De editor plugin wordt dynamisch ingeladen vanuit de factory engine
const pluginPath = path.resolve(__dirname, '../../factory/5-engine/lib/vite-plugin-athena-editor.js');
let athenaEditor = () => ({ name: 'athena-editor-placeholder' });

if (process.env.NODE_ENV !== 'production' && fs.existsSync(pluginPath)) {
    try {
        const module = await import(`file://${pluginPath}`);
        athenaEditor = module.default;
    } catch (e) {
        console.warn("⚠️ Kon Athena Editor plugin niet inladen:", e.message);
    }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    athenaEditor()
  ],
  server: {
    port: 4000,
    strictPort: false,
    cors: true
  }
});