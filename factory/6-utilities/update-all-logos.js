import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function updateAllLogos() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Start met het opschonen van logo-slots in ${sites.length} sites...`);

  for (const site of sites) {
    const headerPath = path.join(SITES_DIR, site, 'src/components/Header.jsx');
    if (fs.existsSync(headerPath)) {
      let content = fs.readFileSync(headerPath, 'utf8');
      
      // Remove background, shadow, and rounded corners from the logo container
      // Old pattern: className="relative w-12 h-12 overflow-hidden rounded-2xl shadow-xl shadow-accent/20 group-hover:scale-105 transition-transform duration-500 bg-accent"
      content = content.replace(
        /className="relative w-12 h-12 overflow-hidden rounded-2xl shadow-xl shadow-accent\/20 group-hover:scale-105 transition-transform duration-500 bg-accent"/g,
        'className="relative w-12 h-12 overflow-hidden transition-transform duration-500"'
      );

      // Change object-cover to object-contain for the logo image
      content = content.replace(
        /className="w-full h-full object-cover"/g,
        'className="w-full h-full object-contain"'
      );

      fs.writeFileSync(headerPath, content);
      console.log(`✅ ${site}: Logo-slot opgeschoond.`);
    }
  }

  console.log('✨ Alle logo-slots zijn bijgewerkt.');
}

updateAllLogos();
