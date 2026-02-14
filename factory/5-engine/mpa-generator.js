/**
 * @file mpa-generator.js
 * @description Genereert een MPA site door templates te kopiëren en data te injecteren.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMPA() {
    const [projectName] = process.argv.slice(2);
    if (!projectName) {
        console.error('❌ Gebruik: node 5-engine/mpa-generator.js <project-naam>');
        process.exit(1);
    }

    const root = path.resolve(__dirname, '..');
    const inputDir = path.join(root, '../input', projectName);
    const siteDir = path.join(root, '../sites', `${projectName}-site`);
    const mpaTemplatesDir = path.join(root, '2-templates/mpa');

    // Formatteer de projectnaam voor weergave (fpc-gent -> FPC Gent)
    const formattedName = projectName.split('-').map(word => {
        if (word.toLowerCase() === 'fpc') return 'FPC';
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    console.log(`🚀 Start MPA Generatie: ${projectName}-site (${formattedName})`);

    // 1. Basis boilerplate (De static-wrapper is een compleet Vite project)
    const boilerplateDir = path.join(root, '2-templates/boilerplate/static-wrapper');
    await fs.cp(boilerplateDir, siteDir, { recursive: true });

    // 2. Update package.json
    const pkgPath = path.join(siteDir, 'package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    pkg.name = `${projectName}-site`;
    if (!pkg.dependencies) pkg.dependencies = {};
    pkg.dependencies["react"] = "^19.0.0";
    pkg.dependencies["react-dom"] = "^19.0.0";
    pkg.dependencies["react-router-dom"] = "^6.20.0";
    
    // Tailwind v4 dependencies
    if (!pkg.devDependencies) pkg.devDependencies = {};
    pkg.devDependencies["tailwindcss"] = "^4.0.0";
    pkg.devDependencies["@tailwindcss/vite"] = "^4.0.0";
    
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

    // 2b. Update vite.config.js voor Tailwind v4 en Athena Editor
    const previewPort = process.env.PREVIEW_PORT || 3000;
    const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

export default defineConfig(async ({ command }) => {
  const isDev = command === 'serve';
  let athenaEditorPlugin = null;

  if (isDev) {
    const pluginPath = path.resolve(__dirname, '../../factory/5-engine/lib/vite-plugin-athena-editor.js');
    if (fs.existsSync(pluginPath)) {
      try {
        const mod = await import(\`file://\${pluginPath}\`);
        athenaEditorPlugin = mod.default;
      } catch (e) {
        console.warn("⚠️ Athena Editor plugin kon niet worden geladen:", e.message);
      }
    }
  }

  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      athenaEditorPlugin ? athenaEditorPlugin() : null
    ].filter(Boolean),
    server: {
      host: true,
      port: ${previewPort},
      strictPort: false,
      cors: true
    }
  };
});
`;
    await fs.writeFile(path.join(siteDir, 'vite.config.js'), viteConfig.trim());

    // 3. Kopieer Componenten
    await fs.mkdir(path.join(siteDir, 'src/components'), { recursive: true });
    
    // MPA Specifieke componenten
    const mpaComponents = ['PageRenderer.jsx', 'Sitemap.jsx', 'Header.jsx', 'Footer.jsx', 'Section.jsx'];
    for (const comp of mpaComponents) {
        let content = await fs.readFile(path.join(mpaTemplatesDir, comp), 'utf8');
        content = content.replace(/{{PROJECT_NAME}}/g, projectName);
        await fs.writeFile(path.join(siteDir, 'src/components', comp), content);
    }

    // Universele Athena componenten (uit docked boilerplate)
    const sharedSrc = path.join(root, '2-templates/boilerplate/docked/shared/components');
    const essentialShared = ['EditableText.jsx', 'EditableMedia.jsx'];
    for (const comp of essentialShared) {
        await fs.copyFile(
            path.join(sharedSrc, comp),
            path.join(siteDir, 'src/components', comp)
        );
    }

    // Kopieer Dock Connector
    await fs.copyFile(
        path.join(root, '5-engine/dock-connector.js'),
        path.join(siteDir, 'src/dock-connector.js')
    );

    // 4. Genereer App.jsx met routes en dynamische nav
    const manifestData = JSON.parse(await fs.readFile(path.join(inputDir, 'json-data/pages-manifest.json'), 'utf8'));
    
    // Probeer het logo uit home.json te halen
    let masterLogo = null;
    try {
        const homeData = JSON.parse(await fs.readFile(path.join(inputDir, 'json-data/pages/home.json'), 'utf8'));
        masterLogo = homeData.meta?.logo;
    } catch (e) {}

    // DYNAMISCHE NAVIGATIE LOGICA
    // We extraheren de hoofdcategorieën uit de paden
    const categories = new Set();
    manifestData.forEach(page => {
        const parts = page.path.split('/').filter(Boolean);
        if (parts.length > 0) {
            // Als het een top-level pagina is, of de eerste map
            categories.add(parts[0]);
        }
    });

    // We filteren en mappen naar een mooi menu (max 7 items)
    const priority = ['over-ons', 'behandelen-en-beveiligen', 'behandeling', 'zorg', 'aanbod', 'jobs', 'werken-bij', 're-integratie', 'events', 'nieuws', 'contact'];
    const navItems = [
        { label: "Home", href: "#/" }
    ];

    // 1. Voeg priority items toe als ze bestaan
    priority.forEach(p => {
        if (categories.has(p)) {
            const label = p.replace(/-/g, ' ');
            navItems.push({ label: label.charAt(0).toUpperCase() + label.slice(1), href: `#/${p}` });
            categories.delete(p); // Verwijder uit set zodat we dubbelen voorkomen
        }
    });

    // 2. Voeg overige categorieën toe (tot max bereikt is)
    const maxNavItems = 8;
    for (const cat of categories) {
        if (navItems.length >= maxNavItems) break;
        // Skip technische mappen
        if (['data', 'assets', 'admin', 'test'].includes(cat)) continue;

        const label = cat.replace(/-/g, ' ');
        navItems.push({ label: label.charAt(0).toUpperCase() + label.slice(1), href: `#/${cat}` });
    }

    navItems.push({ label: "Archief", href: "#/sitemap" });

    const routesJSX = manifestData.map(page => {
        let routePath = page.path === '/home' ? '/' : page.path;
        return `<Route path="${routePath}" element={<PageRenderer file="${page.file}" />} />`;
    }).join('\n                    ');

    let appCode = await fs.readFile(path.join(mpaTemplatesDir, 'App.jsx'), 'utf8');
    
    // Injecteer de dynamische nav via placeholder
    const navString = JSON.stringify(navItems, null, 20).replace(/\n\s+/g, ' ');
    
    // Vervang de Header data
    appCode = appCode.replace(
        /title:\s*["'].*?["']/, 
        `title: "${formattedName}", logo: ${masterLogo ? `"${masterLogo}"` : 'null'}`
    );

    // Vervang /* @NAV_ITEMS@ */ [...] met de nieuwe array
    appCode = appCode.replace(/\/\*\s*@NAV_ITEMS@\s*\*\/[\s\S]*?\]/, `/* @NAV_ITEMS@ */ ${navString}`);

    appCode = appCode.replace('{/* @ROUTES@ */}', `${routesJSX}\n                    <Route path="/sitemap" element={<Sitemap />} />`);
    appCode = appCode.replace(/{{PROJECT_NAME}}/g, projectName);
    await fs.writeFile(path.join(siteDir, 'src/App.jsx'), appCode);

    // 4b. Entry points
    let indexHtml = await fs.readFile(path.join(root, '2-templates/config/index.html'), 'utf8');
    indexHtml = indexHtml.replace(/{{PROJECT_NAME}}/g, formattedName);
    await fs.writeFile(path.join(siteDir, 'index.html'), indexHtml);
    
    // Kopieer CI/CD en Git bestanden
    const configDir = path.join(root, '2-templates/config');
    await fs.mkdir(path.join(siteDir, '.github/workflows'), { recursive: true });
    await fs.copyFile(path.join(configDir, 'deploy.yml'), path.join(siteDir, '.github/workflows/deploy.yml'));
    await fs.copyFile(path.join(configDir, 'project.gitignore'), path.join(siteDir, '.gitignore'));

    // Kopieer icon
    await fs.copyFile(path.join(root, 'athena-icon.svg'), path.join(siteDir, 'public/athena-icon.svg')).catch(() => {});
    
    // Voeg manifest.json toe om 404 te voorkomen
    const webManifest = {
        name: `${projectName} MPA`,
        short_name: projectName,
        start_url: "/",
        display: "standalone"
    };
    await fs.writeFile(path.join(siteDir, 'public/manifest.json'), JSON.stringify(webManifest, null, 2));

    // 4c. Athena Config (CRUCIAAL voor Dock detectie)
    const athenaConfig = {
        projectName: projectName,
        safeName: projectName,
        siteType: "mpa-hydra",
        siteModel: "MPA",
        generatedAt: new Date().toISOString()
    };
    await fs.writeFile(path.join(siteDir, 'athena-config.json'), JSON.stringify(athenaConfig, null, 2));

    const mainCode = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './dock-connector.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
    await fs.writeFile(path.join(siteDir, 'src/main.jsx'), mainCode);
    await fs.writeFile(path.join(siteDir, 'src/index.css'), '/* Tailwind base */\n@import "tailwindcss";');

    // 5. Data injectie
    const dataDest = path.join(siteDir, 'public/data');
    await fs.mkdir(path.join(dataDest, 'pages'), { recursive: true });
    await fs.copyFile(path.join(inputDir, 'json-data/pages-manifest.json'), path.join(dataDest, 'pages-manifest.json'));

    // Kopieer ALLES uit de pages map naar de public map van de site
    const pagesSource = path.join(inputDir, 'json-data/pages');
    const pageFiles = await fs.readdir(pagesSource).catch(() => []);
    for (const file of pageFiles) {
        if (file.endsWith('.json')) {
            await fs.copyFile(path.join(pagesSource, file), path.join(dataDest, 'pages', file));
        }
    }

    // Overschrijf met eventuele handmatig gestructureerde pagina's (uit de structured map)
    const structuredDir = path.join(inputDir, 'json-data/pages/structured');
    const structuredFiles = await fs.readdir(structuredDir).catch(() => []);
    for (const file of structuredFiles) {
        if (file.endsWith('.json')) {
            console.log(`   💎 Overschrijven met gestructureerde data: ${file}`);
            await fs.copyFile(path.join(structuredDir, file), path.join(dataDest, 'pages', file));
        }
    }

    console.log(`✅ KLAAR! Site gegenereerd in sites/${projectName}-site`);
}

generateMPA();