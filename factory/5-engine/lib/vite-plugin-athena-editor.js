import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export default function athenaEditorPlugin() {
  let viteConfig;

  // Laad de factory .env zodat we GITHUB_PAT etc hebben voor deployment
  const factoryDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
  dotenv.config({ path: path.join(factoryDir, '.env') });

  return {
    name: 'vite-plugin-athena-editor',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    configureServer(server) {
      const getDataPath = (file) => {
        if (!file) return null;
        const rootDir = viteConfig?.root || process.cwd();

        // 1. Check of het een MPA pagina is (in public/data/pages)
        const publicDataPath = path.resolve(rootDir, 'public/data/pages', `${file}.json`);
        if (fs.existsSync(publicDataPath)) return publicDataPath;

        // 2. Standaard src/data pad
        const dataDir = path.resolve(rootDir, 'src/data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        return path.join(dataDir, `${file.toLowerCase()}.json`);
      };

      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split('?')[0];

        // CORS HEADERS VOOR DOCK INTERACTIE (Overal toepassen)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // 1. AFBEELDING UPLOAD
        if (req.method === 'POST' && (url.endsWith('/__athena/upload') || url === '/__athena/upload')) {
          console.log(`[Athena Editor] 📥 Incoming Upload: ${req.headers['x-filename']}`);
          const filename = req.headers['x-filename'] || 'upload.jpg';
          const ext = path.extname(filename);
          const nameOnly = path.basename(filename, ext);
          const uniqueName = `${nameOnly}-${Date.now()}${ext}`.replace(/[^a-zA-Z0-9.\-_]/g, '');
          const rootDir = viteConfig?.root || process.cwd();
          const publicDir = path.resolve(rootDir, 'public/images');
          if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

          const fullPath = path.join(publicDir, uniqueName);
          const writer = fs.createWriteStream(fullPath);
          req.pipe(writer);

          writer.on('finish', () => {
            console.log(`[Athena Editor] ✅ Upload Complete: ${uniqueName}`);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, filename: uniqueName }));
          });
          return;
        }

        // 2. JSON UPDATE (Data + Layout + Secties)
        if (req.method === 'POST' && (url.endsWith('/__athena/update-json') || url === '/__athena/update-json')) {
          console.log(`[Athena Editor] 📥 Incoming JSON Update`);
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const payload = JSON.parse(body);
              const { file, index, key, value, action, direction } = payload;

              console.log(`[Athena Editor] Action: ${action || 'update'}, File: ${file || 'N/A'}`);

              if (action === 'swap-style') {
                console.log(`[Athena Editor] 🎨 Swapping style to: ${value}`);
                const rootDir = viteConfig?.root || process.cwd();
                const srcDir = path.resolve(rootDir, 'src');
                const mainPath = path.join(srcDir, 'main.jsx');

                // 1. Try updating import in main.jsx (New Standard)
                if (fs.existsSync(mainPath)) {
                  let content = fs.readFileSync(mainPath, 'utf8');
                  // Look for: import './css/something.css'
                  const cssImportRegex = /(import\s+['"]\.\/css\/)[a-zA-Z0-9\-_]+\.css(['"])/;
                  if (cssImportRegex.test(content)) {
                    const newContent = content.replace(cssImportRegex, `$1${value}$2`);
                    fs.writeFileSync(mainPath, newContent);
                    console.log(`[Athena Editor] ✅ Updated main.jsx import to ./css/${value}`);
                    return res.end(JSON.stringify({ success: true }));
                  }
                }

                // 2. Fallback: Overwrite active CSS file (Old Method)
                const factoryCssDir = path.resolve(rootDir, '../../factory/2-templates/boilerplate/docked/css');
                const sourceCssPath = path.join(factoryCssDir, value);

                if (fs.existsSync(sourceCssPath)) {
                  // Zoek naar het huidige actieve CSS bestand in src/
                  const files = fs.readdirSync(srcDir);
                  const currentCssFile = files.find(f => f.endsWith('.css') && f !== 'index.css' && f !== 'App.css');

                  if (currentCssFile) {
                    const destPath = path.join(srcDir, currentCssFile);
                    fs.copyFileSync(sourceCssPath, destPath);
                    console.log(`[Athena Editor] ✅ Style swapped (overwrite): ${sourceCssPath} -> ${destPath}`);
                    return res.end(JSON.stringify({ success: true }));
                  }
                }
                return res.end(JSON.stringify({ error: "Style file not found or target not identified" }));
              }

              if (action === 'reorder-sections') {
                const orderPath = getDataPath('section_order');
                if (!orderPath) return res.end(JSON.stringify({ error: "No path" }));
                let order = [];
                if (fs.existsSync(orderPath)) {
                  try {
                    order = JSON.parse(fs.readFileSync(orderPath, 'utf8'));
                  }
                  catch (e) { order = []; }
                }
                const currentKey = (key || "").toLowerCase();
                const idx = order.indexOf(currentKey);
                if (idx !== -1) {
                  const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                  if (newIdx >= 0 && newIdx < order.length) {
                    const temp = order[idx];
                    order[idx] = order[newIdx];
                    order[newIdx] = temp;
                    fs.writeFileSync(orderPath, JSON.stringify(order, null, 2));
                  }
                }
                return res.end(JSON.stringify({ success: true }));
              }

              if (action === 'update-section-config') {
                const configPath = getDataPath('display_config');
                if (!configPath) return res.end(JSON.stringify({ error: "No path" }));
                let fullConfig = { sections: {} };
                try {
                  if (fs.existsSync(configPath)) {
                    fullConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                  }
                }
                catch (e) { }

                fullConfig.sections = fullConfig.sections || {};
                if (payload.section) {
                  fullConfig.sections[payload.section] = payload.config;
                  fs.writeFileSync(configPath, JSON.stringify(fullConfig, null, 2));
                }
                return res.end(JSON.stringify({ success: true }));
              }

              if (action === 'deploy-to-github') {
                console.log(`[Athena Editor] 🚀 Triggering Deployment/Push to GitHub...`);
                const rootDir = viteConfig?.root || process.cwd();
                const projectName = path.basename(rootDir);
                const commitMsg = payload.commitMsg || "Deploy from Athena Dock";

                try {
                  const deployWizardPath = path.resolve(rootDir, '../../factory/5-engine/deploy-wizard.js');
                  const { deployProject } = await import(`file://${deployWizardPath}`);
                  const result = await deployProject(projectName, commitMsg);
                  console.log(`[Athena Editor] ✅ Action Successful:`, result.liveUrl);
                  return res.end(JSON.stringify({ success: true, ...result }));
                } catch (err) {
                  console.error(`[Athena Editor] ❌ Action Failed:`, err);
                  return res.end(JSON.stringify({ error: err.message }));
                }
              }

              if (!file) {
                return res.end(JSON.stringify({ success: true, message: "No file provided" }));
              }

              const dataPath = getDataPath(file);
              if (!dataPath) return res.end(JSON.stringify({ error: "Invalid path" }));

              // Handle Formatting (Style Bindings)
              if (payload.formatting) {
                const stylePath = getDataPath('style_bindings');
                let styles = {};
                if (fs.existsSync(stylePath)) {
                  try { styles = JSON.parse(fs.readFileSync(stylePath, 'utf8')); }
                  catch (e) { styles = {}; }
                }
                const styleKey = `${file}:${index}:${key}`;
                styles[styleKey] = payload.formatting;
                fs.writeFileSync(stylePath, JSON.stringify(styles, null, 2));
                console.log(`[Athena Editor] Styles saved for ${styleKey}`);
              }

              let data = null;
              if (fs.existsSync(dataPath)) {
                try {
                  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                } catch (e) { console.error(`Error parsing ${file}.json:`, e); }
              }

              // Bepaal of we met een array of object werken
              let isArray = Array.isArray(data);
              if (data === null) {
                // Nieuw bestand: bepaal type op basis van actie of bestandnaam
                isArray = (action === 'add' || file === 'testimonials' || file === 'teamleden');
                data = isArray ? [] : {};
              }

              if (action === 'add' && isArray) {
                const template = data.length > 0 ? { ...data[0] } : { naam: "Nieuw Item" };
                Object.keys(template).forEach(k => {
                  if (typeof template[k] === 'string') template[k] = `Nieuw ${k}`;
                  if (k.includes('foto') || k.includes('image')) template[k] = "";
                  if (k === '_hidden') template[k] = false;
                });
                data.push(template);
              }
              else if (action === 'restore' && isArray) {
                // Restore an item at a specific index (for undo)
                if (index !== undefined && value) {
                  data.splice(index, 0, value);
                }
              }
              else if (action === 'delete' && isArray) {
                if (index !== undefined) data.splice(index, 1);
              }
              else {
                // Standaard veld update
                if (isArray) {
                  const idx = parseInt(index || 0);
                  if (!data[idx]) data[idx] = {};

                  // AFHANDELING VAN LINKS (Label/URL Split)
                  if (typeof value === 'object' && value !== null && 'label' in value && 'url' in value) {
                    console.log(`[Athena Editor] 🔗 Link Handling: Saving full object to ${file}`);
                    data[idx][key] = value; // v7.8.7: Save FULL object to main data

                    // Sla URL OOK op in links_config (voor backwards compatibility/Sheets sync)
                    const linksPath = getDataPath('links_config');
                    let links = {};
                    if (fs.existsSync(linksPath)) {
                      try { links = JSON.parse(fs.readFileSync(linksPath, 'utf8')); }
                      catch (e) { links = {}; }
                    }
                    links[`${file}:${idx}:${key}`] = value.url;
                    fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
                  } else {
                    data[idx][key] = value;
                  }
                } else {
                  // Normale object update (voor site_settings etc)
                  if (typeof value === 'object' && value !== null && 'label' in value && 'url' in value) {
                    console.log(`[Athena Editor] 🔗 Link Handling (Object): Saving full object to ${file}`);

                    const keys = key.split('.');
                    let current = data;
                    for (let i = 0; i < keys.length - 1; i++) {
                      const k = keys[i];
                      if (!current[k]) current[k] = isNaN(keys[i + 1]) ? {} : [];
                      current = current[k];
                    }
                    current[keys[keys.length - 1]] = value; // v7.8.7: Save FULL object

                    // Sla URL OOK op in links_config
                    const linksPath = getDataPath('links_config');
                    let links = {};
                    if (fs.existsSync(linksPath)) {
                      try { links = JSON.parse(fs.readFileSync(linksPath, 'utf8')); }
                      catch (e) { links = {}; }
                    }
                    links[`${file}:${index || 0}:${key}`] = value.url;
                    fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
                  } else {
                    const keys = key.split('.');
                    let current = data;
                    for (let i = 0; i < keys.length - 1; i++) {
                      const k = keys[i];
                      if (!current[k]) current[k] = isNaN(keys[i + 1]) ? {} : [];
                      current = current[k];
                    }
                    current[keys[keys.length - 1]] = value;
                  }
                }
              }

              fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              console.error(`[Athena Editor] CRITICAL ERROR:`, e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message, stack: e.stack }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}