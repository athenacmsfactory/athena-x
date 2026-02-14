import React, { useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';

import { DisplayConfigProvider } from './components/DisplayConfigContext';

const App = ({ data }) => {
  const primaryTable = Object.keys(data)[0];

  // --- DESIGN & THEMING ENGINE ---
  React.useEffect(() => {
    const settings = Array.isArray(data.site_settings) ? (data.site_settings[0] || {}) : (data.site_settings || {});
    const root = document.documentElement;

    // Theme Switch
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    // Mappings
    const mappings = {
      light_primary_color: '--color-primary',
      light_heading_color: '--color-heading',
      light_title_color: '--color-title',
      light_accent_color: '--color-accent',
      light_button_color: '--color-button-bg',
      light_card_color: ['--color-card-bg', '--color-surface'],
      light_header_color: '--color-header-bg',
      light_bg_color: '--color-background',
      light_hero_bg_color: '--color-hero-bg',
      light_text_color: '--color-text',
      hero_height: '--hero-height',
      hero_max_height: '--hero-max-height',
      hero_aspect_ratio: '--hero-aspect-ratio',
      dark_primary_color: '--color-primary',
      dark_heading_color: '--color-heading',
      dark_title_color: '--color-title',
      dark_accent_color: '--color-accent',
      dark_button_color: '--color-button-bg',
      dark_card_color: ['--color-card-bg', '--color-surface'],
      dark_header_color: '--color-header-bg',
      dark_bg_color: '--color-background',
      dark_hero_bg_color: '--color-hero-bg',
      dark_text_color: '--color-text',
      global_radius: '--radius-custom',
      global_shadow: '--shadow-main',
      header_height: '--header-height',
      content_top_offset: '--content-top-offset'
    };

    const isDark = root.classList.contains('dark');
    const prefix = isDark ? 'dark_' : 'light_';

    // Apply standard mappings
    Object.keys(settings).forEach(key => {
      const varNames = mappings[key];
      if (varNames) {
        let val = settings[key];
        
        if (key === 'global_shadow') {
          if (val === 'soft') val = '0 4px 20px -2px rgba(0, 0, 0, 0.05)';
          else if (val === 'strong') val = '0 20px 50px -5px rgba(0, 0, 0, 0.15)';
          else if (val === 'none') val = 'none';
        }

        if (key === 'header_height' || key === 'content_top_offset') {
          if (val && !String(val).endsWith('px') && !String(val).endsWith('rem') && !String(val).endsWith('vh')) {
              val = val + 'px';
          }
        }
        
        if (Array.isArray(varNames)) {
          varNames.forEach(v => root.style.setProperty(v, val));
        } else {
          root.style.setProperty(varNames, val);
        }
      }
    });

    // --- HEADER TRANSPARENCY LOGIC ---
    if (settings.header_transparent === true) {
        root.style.setProperty('--header-bg', 'transparent');
        root.style.setProperty('--header-blur', 'none');
        root.style.setProperty('--header-border', 'none');
    } else {
        root.style.removeProperty('--header-bg');
        root.style.removeProperty('--header-blur');
        root.style.removeProperty('--header-border');
    }

    // --- HERO OVERLAY SPECIFIEKE LOGICA ---
    const opacityVal = settings.hero_overlay_opacity;
    const opacity = (opacityVal !== undefined && opacityVal !== null && opacityVal !== "") ? parseFloat(opacityVal) : 0.8;
    root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);
    root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);

  }, [data.site_settings]);

  const content = (
    <DisplayConfigProvider data={data}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
          <Header primaryTable={data[primaryTable]} tableName={primaryTable} siteSettings={data['site_settings']} />

          <main style={{ paddingTop: 'var(--content-top-offset, 0px)' }}>
            <Section data={data} />
          </main>

          <Footer data={data} />
        </div>
      </Router>
    </DisplayConfigProvider>
  );


  return content;
};

export default App;
