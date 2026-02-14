import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function updateAllConnectors() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Start met het updaten van dock-connector.js in ${sites.length} sites...`);

  for (const site of sites) {
    const connectorPath = path.join(SITES_DIR, site, 'src/dock-connector.js');
    if (fs.existsSync(connectorPath)) {
      let content = fs.readFileSync(connectorPath, 'utf8');
      
      if (!content.includes('e.shiftKey')) {
        content = content.replace(
          'if (target && window.parent !== window) {',
          'if (target && window.parent !== window) {\n            if (e.shiftKey) return;'
        );
        
        fs.writeFileSync(connectorPath, content);
        console.log(`✅ ${site}: dock-connector.js bijgewerkt.`);
      }
    }
  }

  console.log("✨ Alle connectors zijn bijgewerkt.");
}

updateAllConnectors();