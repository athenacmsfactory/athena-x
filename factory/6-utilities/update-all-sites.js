import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSectionComponent } from '../5-engine/logic/standard-layout-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateAllSites() {
    const root = path.resolve(__dirname, '../..');
    const sitesDir = path.join(root, 'sites');
    const factoryDir = path.join(root, 'factory');
    const TPL = path.join(factoryDir, '2-templates');

    const sites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());

    console.log(`🚀 Starting Global Update for ${sites.length} sites...\n`);

    for (const siteName of sites) {
        const projectDir = path.join(sitesDir, siteName);
        const configPath = path.join(projectDir, 'athena-config.json');
        
        if (!fs.existsSync(configPath)) {
            console.log(`⏭️  Skipping ${siteName} (no athena-config.json)`);
            continue;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const isDocked = fs.existsSync(path.join(factoryDir, '3-sitetypes/docked', config.siteType || ''));
        const track = isDocked ? 'docked' : 'autonomous';

        console.log(`🛠️  Updating ${siteName} (${track})...`);

        try {
            // 1. Copy EditableLink.jsx
            const linkSrc = path.join(TPL, `boilerplate/${track}/shared/components/EditableLink.jsx`);
            if (fs.existsSync(linkSrc)) {
                fs.copyFileSync(linkSrc, path.join(projectDir, 'src/components/EditableLink.jsx'));
                console.log(`   ✅ EditableLink.jsx added.`);
            }

            // 2. Sync dock-connector.js
            const connectorSrc = path.join(TPL, `boilerplate/${track}/shared/public/dock-connector.js`);
            if (fs.existsSync(connectorSrc)) {
                // Try to find where it is currently
                const possiblePaths = ['src/dock-connector.js', 'public/dock-connector.js'];
                let found = false;
                for (const p of possiblePaths) {
                    if (fs.existsSync(path.join(projectDir, p))) {
                        fs.copyFileSync(connectorSrc, path.join(projectDir, p));
                        console.log(`   ✅ dock-connector.js updated at ${p}.`);
                        found = true;
                    }
                }
                if (!found) {
                    fs.copyFileSync(connectorSrc, path.join(projectDir, 'src/dock-connector.js'));
                    console.log(`   ✅ dock-connector.js added to src/.`);
                }
            }

            // 3. Update main.jsx (Data Loading Logic)
            const mainPath = path.join(projectDir, 'src/main.jsx');
            if (fs.existsSync(mainPath)) {
                let mainContent = fs.readFileSync(mainPath, 'utf8');
                
                // Add links_config loading if not present
                if (!mainContent.includes("data['links_config']")) {
                    const searchPattern = /data\[\'display_config\'\] = getData\(\'display_config\'\) \|\| \{ sections: \{\} \};/g;
                    const replacement = "data['display_config'] = getData('display_config') || { sections: {} };\n    data['links_config'] = getData('links_config') || {};";
                    mainContent = mainContent.replace(searchPattern, replacement);
                }

                // Add links merging if not present
                if (!mainContent.includes("// 🔥 Links merging logic")) {
                    const mergingLogic = `
    // 🔥 Links merging logic
    Object.entries(data['links_config']).forEach(([keyPath, url]) => {
        const [file, indexStr, key] = keyPath.split(':');
        const index = parseInt(indexStr);
        if (data[file] && data[file][index]) {
            data[file][index][`\${key}_url`]` = url;
        } else if (data[file] && !Array.isArray(data[file])) {
            data[file][`\${key}_url`]` = url;
        }
    });`;
                    
                    const anchorPattern = /for \(const sectionName of data\[\'section_order\'\) \{\[\s\S\]*?\}\s*?\n/;
                    const match = mainContent.match(anchorPattern);
                    if (match) {
                        const insertPos = match.index + match[0].length;
                        mainContent = mainContent.slice(0, insertPos) + mergingLogic + mainContent.slice(insertPos);
                    }
                }

                fs.writeFileSync(mainPath, mainContent);
                console.log(`   ✅ main.jsx updated.`);
            }

            // 4. Update Header.jsx & Footer.jsx
            const components = ['Header.jsx', 'Footer.jsx'];
            for (const comp of components) {
                const compPath = path.join(projectDir, 'src/components', comp);
                const tplPath = path.join(TPL, `boilerplate/${track}/SPA/components`, comp);
                
                if (fs.existsSync(compPath) && fs.existsSync(tplPath)) {
                    let tplContent = fs.readFileSync(tplPath, 'utf8');
                    // Replace placeholders
                    tplContent = tplContent.replace(/{{PROJECT_NAME}}/g, config.projectName);
                    // Minimal fix for imports
                    tplContent = tplContent.replace(/from '.\/Editable/g, "from './Editable"); 
                    
                    fs.writeFileSync(compPath, tplContent);
                    console.log(`   ✅ ${comp} updated from template.`);
                }
            }

            // 5. Update fetch-data.js
            const fetchPath = path.join(projectDir, 'fetch-data.js');
            const fetchTpl = path.join(TPL, 'logic/fetch-data.js');
            if (fs.existsSync(fetchPath) && fs.existsSync(fetchTpl)) {
                fs.copyFileSync(fetchTpl, fetchPath);
                console.log(`   ✅ fetch-data.js updated.`);
            }

            // 6. Regenerate Section.jsx (if applicable)
            const blueprintPath = path.join(projectDir, 'src/data/schema.json');
            if (fs.existsSync(blueprintPath)) {
                const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
                const newSectionCode = generateSectionComponent(blueprint, track);
                fs.writeFileSync(path.join(projectDir, 'src/components/Section.jsx'), newSectionCode);
                console.log(`   ✅ Section.jsx regenerated.`);
            }

            console.log(`   ✨ ${siteName} update complete.\n`);
        } catch (err) {
            console.error(`   ❌ Failed to update ${siteName}:`, err.message);
        }
    }

    console.log("🏁 All sites updated successfully!");
}

updateAllSites();
