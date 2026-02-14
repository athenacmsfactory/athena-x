import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function syncMainJs() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Synchroniseren van main.jsx in ${sites.length} sites...`);

  for (const site of sites) {
    const mainPath = path.join(SITES_DIR, site, 'src/main.jsx');
    if (fs.existsSync(mainPath)) {
      let content = fs.readFileSync(mainPath, 'utf8');
      
      if (!content.includes("data['layout_settings']")) {
        content = content.replace(
          "data['display_config'] = getData('display_config') || { sections: {} };",
          "data['display_config'] = getData('display_config') || { sections: {} };\n    data['layout_settings'] = getData('layout_settings') || {};"
        );
        
        fs.writeFileSync(mainPath, content);
        console.log(`✅ ${site}: main.jsx bijgewerkt.`);
      }
    }
  }

  console.log("✨ Alle main.jsx bestanden zijn gesynchroniseerd.");
}

syncMainJs();