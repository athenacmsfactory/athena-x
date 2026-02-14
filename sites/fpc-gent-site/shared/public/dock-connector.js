(function() {
  try {
    if (window.self === window.top) return;
  } catch (e) { return; }

  console.log("⚓ Athena Dock Connector v6 Initialized");

  // State
  let currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  // Uitgebreide mapping per thema
  const themeMappings = {
    light: {
      'light_primary_color': ['--color-primary', '--primary-color-light', '--primary-color'],
      'light_accent_color': ['--color-accent', '--accent-color-light', '--accent-color'],
      'light_bg_color': ['--color-background', '--bg-site-light', '--bg-site', '--color-bg-site'],
      'light_text_color': ['--color-text', '--text-color-light', '--text-color', '--color-text-main']
    },
    dark: {
      'dark_primary_color': ['--color-primary', '--primary-color-dark', '--primary-color'],
      'dark_accent_color': ['--color-accent', '--accent-color-dark', '--accent-color'],
      'dark_bg_color': ['--color-background', '--bg-site-dark', '--bg-site', '--color-bg-site'],
      'dark_text_color': ['--color-text', '--text-color-dark', '--text-color', '--color-text-main']
    }
  };

  function notifyDock() {
    const sections = Array.from(document.querySelectorAll('[data-dock-section]'))
      .map(el => el.getAttribute('data-dock-section'));

    const fallbacks = Array.from(document.querySelectorAll('section[id]')).map(el => el.id);
    const finalSections = sections.length > 0 ? sections : fallbacks;

    console.log("🔍 [Connector] Gevonden secties:", finalSections);

    if (finalSections.length > 0) {
      window.parent.postMessage({
        type: 'SITE_READY',
        structure: {
          title: document.title,
          sections: finalSections
        }
      }, '*');
      return true;
    }
    return false;
  }

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (notifyDock() || attempts > 20) clearInterval(interval);
  }, 1000);

  window.addEventListener('message', (event) => {
    const { type, key, value } = event.data;

    if (type === 'DOCK_UPDATE_COLOR') {
      if (key === 'theme') {
        currentTheme = value;
        if (value === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return;
      }

      // Alleen toepassen als de kleur bij het huidige thema hoort OF als we force-override doen
      // Om 'tegelijkertijd werken' te voorkomen, kijken we naar de prefix
      const isDarkKey = key.startsWith('dark_');
      const isLightKey = key.startsWith('light_');

      if ((currentTheme === 'dark' && isDarkKey) || (currentTheme === 'light' && isLightKey)) {
        const cssVars = themeMappings[currentTheme][key];
        if (cssVars) {
          cssVars.forEach(v => {
            document.documentElement.style.setProperty(v, value, 'important');
          });
        }
      }
    }

    if (type === 'DOCK_UPDATE_TEXT') {
      const { file, index, key, value } = event.data;
      document.querySelectorAll('[data-dock-bind]').forEach(el => {
        try {
          const b = JSON.parse(el.getAttribute('data-dock-bind'));
          if (b.file === file && b.key === key && b.index === index) {
            if (el.tagName === 'IMG') el.src = value;
            else el.innerText = value;
          }
        } catch(e) {}
      });
    }

    if (type === 'DOCK_MOVE_SECTION' || type === 'DOCK_RELOAD') window.location.reload();
  });
})();