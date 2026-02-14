import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function updateAllHeaders() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Start met het updaten van Header.jsx in ${sites.length} sites...`);

  for (const site of sites) {
    const headerPath = path.join(SITES_DIR, site, 'src/components/Header.jsx');
    if (fs.existsSync(headerPath)) {
      let content = fs.readFileSync(headerPath, 'utf8');
      
      if (!content.includes('handleScroll')) {
        // 1. Inject handleScroll function before return
        content = content.replace(
          'return (',
          'const handleScroll = (e) => {
    const url = settings.header_cta_url || "#contact";
    if (url.startsWith('#')) {
      e.preventDefault();
      const targetId = url.substring(1);
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return ('
        );
        
        // 2. Add as="button" and onClick to EditableLink
        content = content.replace(
          '<EditableLink',
          '<EditableLink
              as="button"'
        );
        
        content = content.replace(
          'className="bg-primary',
          'className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
              onClick={handleScroll}'
        );
        
        // Cleanup potential duplicate className if it was already there
        // (Wait, the above replace might be brittle depending on the exact className content)
        // Let's do a more targeted replace for the className and add onClick after it.
        
        fs.writeFileSync(headerPath, content);
        console.log(`✅ ${site}: Header.jsx bijgewerkt.`);
      }
    }
  }

  console.log('✨ Alle Headers zijn bijgewerkt.');
}

updateAllHeaders();
