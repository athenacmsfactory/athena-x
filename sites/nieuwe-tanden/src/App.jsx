import StyleInjector from './components/StyleInjector';
import React, { useMemo, useEffect, useLayoutEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';

const App = ({ data }) => {
  // Build ID: 20260201-1615
  const settings = useMemo(() => {
    if (!data.site_settings) return {};
    return Array.isArray(data.site_settings) ? (data.site_settings[0] || {}) : (data.site_settings || {});
  }, [data.site_settings]);

  const isDark = settings.theme === 'dark';

  // Apply variables directly to documentElement to avoid flicker and allow overrides
  useLayoutEffect(() => {
    const root = document.documentElement;
    const mappings = {
        light_primary_color: ['--color-primary', '--primary-color'],
        light_title_color: ['--color-title'],
        light_heading_color: ['--color-heading'],
        light_accent_color: ['--color-accent'],
        light_button_color: ['--color-button-bg', '--btn-bg'],
        light_card_color: ['--color-card-bg', '--color-surface'],
        light_header_color: ['--color-header-bg'],
        light_bg_color: ['--color-background', '--bg-site'],
        light_text_color: ['--color-text'],
        dark_primary_color: ['--color-primary'],
        dark_title_color: ['--color-title'],
        dark_heading_color: ['--color-heading'],
        dark_accent_color: ['--color-accent'],
        dark_button_color: ['--color-button-bg'],
        dark_card_color: ['--color-card-bg', '--color-surface'],
        dark_header_color: ['--color-header-bg'],
        dark_bg_color: ['--color-background', '--bg-site'],
        dark_text_color: ['--color-text'],
        global_radius: ['--radius-custom'],
        global_shadow: ['--shadow-main']
    };

    // Theme Class
    if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
    } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
    }

    // Apply Settings
    Object.keys(settings).forEach(key => {
        const isDarkKey = key.startsWith('dark_');
        const isLightKey = key.startsWith('light_');
        
        if ((isDark && isDarkKey) || (!isDark && isLightKey) || key.startsWith('global_')) {
            const varNames = mappings[key];
            if (varNames && settings[key]) {
                varNames.forEach(varName => root.style.setProperty(varName, settings[key]));
            }
        }
    });

    // Nuclear Fallback for surface/background if missing
    if (!root.style.getPropertyValue('--color-background')) {
        root.style.setProperty('--color-background', isDark ? '#0f172a' : '#ffffff');
    }
    if (!root.style.getPropertyValue('--color-surface')) {
        root.style.setProperty('--color-surface', isDark ? '#1e293b' : '#f8fafc');
    }

    // Special: Hero Overlay
    if (settings.hero_overlay_opacity) {
        root.style.setProperty('--hero-overlay-opacity', settings.hero_overlay_opacity);
    }
  }, [settings, isDark]);

  // Zoek de eerste echte data-tabel (meestal 'basisgegevens')
  const primaryTableKey = data.section_order?.[0] || Object.keys(data).find(k => !['section_order', 'layout_settings', 'site_settings', 'section_settings', 'display_config', 'style_bindings', 'links_config'].includes(k));
  const primaryTableData = data[primaryTableKey] || [];
  
  const content = (
    <Router>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <StyleInjector siteSettings={data['site_settings']} />
        <Header primaryTable={primaryTableData} tableName={primaryTableKey} siteSettings={data['site_settings']} />
        
        <main>
          <Section data={data} />
        </main>

        <Footer primaryTable={primaryTableData} />
      </div>
    </Router>
  );

  return content;
};

export default App;