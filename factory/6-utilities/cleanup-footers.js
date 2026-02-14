import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function cleanupFooters() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Opschonen van Footers in ${sites.length} sites...`);

  for (const site of sites) {
    const footerPath = path.join(SITES_DIR, site, 'src/components/Footer.jsx');
    if (fs.existsSync(footerPath)) {
      let content = fs.readFileSync(footerPath, 'utf8');
      
      if (content.includes('siteSettings.footer_text')) {
        content = content.replace(/siteSettings\.footer_text/g, 'settings.footer_text');
        fs.writeFileSync(footerPath, content);
        console.log(`✅ ${site}: Footer.jsx ReferenceError gefixt.`);
      }
    }
  }

  console.log('✨ Alle Footers zijn opgeschoond.');
}

cleanupFooters();
