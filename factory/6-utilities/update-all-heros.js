import fs from 'fs';
import path from 'path';

const SITES_DIR = './sites';

async function updateAllSites() {
  const sites = fs.readdirSync(SITES_DIR).filter(f => fs.statSync(path.join(SITES_DIR, f)).isDirectory());

  console.log(`🚀 Start met het updaten van ${sites.length} sites...`);

  for (const site of sites) {
    const sitePath = path.join(SITES_DIR, site);
    console.log(`--- Updaten: ${site} ---`);

    // 1. Update App.jsx (Theming Mappings)
    const appPath = path.join(sitePath, 'src/App.jsx');
    if (fs.existsSync(appPath)) {
      let content = fs.readFileSync(appPath, 'utf8');
      if (!content.includes('hero_height:')) {
        content = content.replace(
          "light_text_color: '--color-text',",
          "light_text_color: '--color-text',\n      hero_height: '--hero-height',\n      hero_max_height: '--hero-max-height',\n      hero_aspect_ratio: '--hero-aspect-ratio',"
        );
        fs.writeFileSync(appPath, content);
        console.log(`✅ App.jsx bijgewerkt.`);
      }
    }

    // 2. Update Section.jsx (Hero Component Logic)
    const sectionPath = path.join(sitePath, 'src/components/Section.jsx');
    if (fs.existsSync(sectionPath)) {
      let content = fs.readFileSync(sectionPath, 'utf8');
      
      // Update the hero section class and image alignment
      if (content.includes('className="relative h-[85vh] flex')) {
        content = content.replace(
          'className="relative h-[85vh] flex items-center justify-center overflow-hidden',
          'className="relative w-full h-auto min-h-[var(--hero-height,85vh)] max-h-[var(--hero-max-height,150vh)] aspect-[var(--hero-aspect-ratio,16/9)] flex items-center justify-center overflow-hidden'
        );
        content = content.replace(
          'className="w-full h-full object-cover"',
          'className="w-full h-full object-cover object-top"'
        );
        fs.writeFileSync(sectionPath, content);
        console.log(`✅ Section.jsx bijgewerkt.`);
      }
    }

    // 3. Update site_settings.json (Default values)
    const settingsPath = path.join(sitePath, 'src/data/site_settings.json');
    if (fs.existsSync(settingsPath)) {
      try {
        let settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        let target = Array.isArray(settings) ? settings[0] : settings;
        
        if (target && !target.hero_height) {
          target.hero_height = "85vh";
          target.hero_max_height = "150vh";
          target.hero_aspect_ratio = "16/9";
          fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
          console.log(`✅ site_settings.json bijgewerkt.`);
        }
      } catch (e) {
        console.error(`❌ Fout bij verwerken site_settings.json voor ${site}:`, e.message);
      }
    }
  }

  console.log('✨ Alle sites zijn succesvol bijgewerkt naar de nieuwe hero-standaard.');
}

updateAllSites();