import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function fixSectionIds() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Start met het toevoegen van sectie-ID's in ${sites.length} sites...`);

  for (const site of sites) {
    const sectionPath = path.join(SITES_DIR, site, 'src/components/Section.jsx');
    if (fs.existsSync(sectionPath)) {
      let content = fs.readFileSync(sectionPath, 'utf8');
      
      // Update shop sections
      content = content.replace(
          /section key=\{idx\} data-dock-section=\{sectionName\} className="py-24 px-6 bg-background"/g,
          'section key={idx} id={sectionName} data-dock-section={sectionName} className="py-24 px-6 bg-background"'
      );

      // Update standard sections
      content = content.replace(
          /section key=\{idx\} data-dock-section=\{sectionName\} className=\{'py-24 px-6 '/g,
          'section key={idx} id={sectionName} data-dock-section={sectionName} className={\'py-24 px-6 \''
      );

      fs.writeFileSync(sectionPath, content);
      console.log(`✅ ${site}: Sectie-ID's bijgewerkt.`);
    }
  }

  console.log("✨ Alle Sectie-ID's zijn bijgewerkt.");
}

fixSectionIds();