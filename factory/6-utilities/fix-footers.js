import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function fixAllFooters() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Start met het robuust maken van Footers in ${sites.length} sites...`);

  for (const site of sites) {
    const footerPath = path.join(SITES_DIR, site, 'src/components/Footer.jsx');
    if (fs.existsSync(footerPath)) {
      let content = fs.readFileSync(footerPath, 'utf8');
      
      if (!content.includes('settingsSource')) {
        // Replace extraction logic
        content = content.replace(
          'const siteSettings = data?.site_settings || {};',
          'const settingsSource = data?.site_settings || {};\n  const settings = Array.isArray(settingsSource) ? (settingsSource[0] || {}) : settingsSource;'
        );
        
        // Replace variable usages
        content = content.replace(/siteSettings\./g, 'settings.');
        
        fs.writeFileSync(footerPath, content);
        console.log(`✅ ${site}: Footer.jsx bijgewerkt.`);
      }
    }
  }

  console.log("✨ Alle Footers zijn bijgewerkt.");
}

fixAllFooters();