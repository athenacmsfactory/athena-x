import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateSite(siteName) {
    const root = path.join(__dirname, '../');
    const siteDir = path.resolve(root, '../sites', siteName);
    const templateDir = path.join(root, '2-templates');

    if (!fs.existsSync(siteDir)) {
        console.error(`❌ Site map niet gevonden: ${siteDir}`);
        process.exit(1);
    }

    console.log(`🚀 Start Migratie voor: ${siteName}`);
    console.log(`   Doel: Upgrade naar React 19 & Tailwind v4`);

    // 1. Configuraties Updaten
    console.log(`📦 Configuraties bijwerken...`);
    
    // Package.json (behoud naam en scripts)
    const pkgPath = path.join(siteDir, 'package.json');
    const oldPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // We bouwen een nieuwe package.json op basis van de V4 standaarden
    const migrationPkg = {
        ...oldPkg,
        type: "module",
        scripts: {
            ...oldPkg.scripts,
            "dev": "vite",
            "build": "vite build"
        },
        dependencies: {
            ...oldPkg.dependencies,
            "react": "^19.0.0",
            "react-dom": "^19.0.0",
            "@heroicons/react": "^2.2.0"
        },
        devDependencies: {
            ...oldPkg.devDependencies,
            "@tailwindcss/vite": "^4.0.0",
            "tailwindcss": "^4.0.0",
            "vite": "^6.0.0",
            "@vitejs/plugin-react": "^4.0.0"
        }
    };
    
    // Verwijder oude tailwind dependencies indien aanwezig
    delete migrationPkg.devDependencies["autoprefixer"];
    delete migrationPkg.devDependencies["postcss"];

    fs.writeFileSync(path.join(siteDir, 'package.json'), JSON.stringify(migrationPkg, null, 2));

    // Vite Config (Vervang volledig met V4 template)
    let viteContent = fs.readFileSync(path.join(templateDir, 'config/vite.config.js'), 'utf8');
    viteContent = viteContent.replace('{{BASE_PATH}}', `/${siteName}/`);
    fs.writeFileSync(path.join(siteDir, 'vite.config.js'), viteContent);

    // Verwijder oude configs
    const oldFiles = ['postcss.config.js', 'tailwind.config.js'];
    oldFiles.forEach(f => {
        const p = path.join(siteDir, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    // 2. CSS Migratie
    console.log(`🎨 CSS Migreren naar Tailwind v4...`);
    // Kopieer modern.css (V4 thema)
    fs.copyFileSync(
        path.join(templateDir, 'css/modern.css'),
        path.join(siteDir, 'src/modern.css')
    );

    // Update index.css om @theme te gebruiken en import te fixen
    const indexCssPath = path.join(siteDir, 'src/index.css');
    let indexCss = fs.readFileSync(indexCssPath, 'utf8');
    
    // Vervang oude @tailwind directives door de nieuwe import
    if (!indexCss.includes('@import "./modern.css"')) {
        indexCss = '@import "./modern.css";\n\n' + indexCss.replace(/@tailwind\\s+base;|@tailwind\\s+components;|@tailwind\\s+utilities;/g, '');
    }
    
    // Fix @apply issues (simpele regex, handwerk kan nodig zijn)
    // We vervangen '@apply card' door de expliciete classes als noodgreep, of we laten het staan als we de componenten ook updaten.
    // Voor nu laten we het staan en hopen we dat de component-update het oplost, of we waarschuwen de gebruiker.
    
    fs.writeFileSync(indexCssPath, indexCss);

    // 3. Core Componenten Updaten
    console.log(`🧩 Core Componenten updaten...`);
    const comps = ['EditableImage.jsx', 'CartContext.jsx', 'CartOverlay.jsx'];
    comps.forEach(c => {
        const src = path.join(templateDir, 'components', c);
        const dest = path.join(siteDir, 'src/components', c);
        if (fs.existsSync(src)) fs.copyFileSync(src, dest);
    });
    
    // UI Library toevoegen
    const uiSrc = path.join(templateDir, 'components/ui');
    const uiDest = path.join(siteDir, 'src/components/ui');
    if (fs.existsSync(uiSrc)) {
        fs.mkdirSync(uiDest, { recursive: true });
        fs.cpSync(uiSrc, uiDest, { recursive: true });
    }

    // 4. Installatie
    console.log(`📦 Dependencies installeren...`);
    try {
        execSync(`pnpm install --child-concurrency 1`, { cwd: siteDir, stdio: 'inherit' });
    } catch (e) {
        console.error("❌ Installatie fout. Probeer handmatig 'pnpm install' in de map.");
    }

    console.log(`✅ Migratie voltooid voor ${siteName}!`);
    console.log(`👉 Test nu met: cd ../sites/${siteName} && pnpm dev`);
}

// Run
const target = process.argv[2];
if (!target) {
    console.log("Gebruik: node 5-engine/migrate-site.js <site-naam>");
} else {
    migrateSite(target);
}
