import React, { useLayoutEffect } from 'react';

/**
 * StyleInjector
 * Synchronizes Athena JSON settings with CSS Custom Properties (Variables).
 * This ensures the site looks correct both in standalone mode and in the Dock.
 */
const StyleInjector = ({ hero = {}, headerSettings = {} }) => {
  const hData = Array.isArray(hero) ? (hero[0] || {}) : hero;
  const sData = Array.isArray(headerSettings) ? (headerSettings[0] || {}) : headerSettings;
  const settings = { ...hData, ...sData };

  useLayoutEffect(() => {
    const root = document.documentElement;
    const isDark = settings.theme === 'dark';

    // 1. Theme Toggle
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // 2. Map Settings to CSS Variables
    const prefix = isDark ? 'dark_' : 'light_';

    // Core Colors Mapping
    const mappings = {
      'primary_color': ['--color-primary', '--primary-color'],
      'title_color': ['--color-title'],
      'heading_color': ['--color-heading'],
      'accent_color': ['--color-accent'],
      'button_color': ['--color-button'],
      'card_color': ['--color-card', '--bg-surface'],
      'header_color': ['--color-header', '--bg-header'],
      'footer_color': ['--color-footer-bg'],
      'bg_color': ['--color-background', '--bg-site'],
      'text_color': ['--color-text']
    };

    Object.entries(mappings).forEach(([key, vars]) => {
      const val = settings[`${prefix}${key}`];
      if (val) {
        vars.forEach(v => root.style.setProperty(v, val));
      }
    });

    // 3. Global Variables
    if (settings.global_radius) root.style.setProperty('--radius-custom', settings.global_radius);

    // Hero overlay: convert opacity to rgba values used by Section.jsx gradient
    const heroOpacity = settings.hero_overlay_transparantie !== undefined ? settings.hero_overlay_transparantie : settings.hero_overlay_opacity;
    if (heroOpacity !== undefined) {
      let opacity = parseFloat(heroOpacity);
      if (isNaN(opacity)) opacity = 0.8;
      root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);
      root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);
    }

    if (settings.content_top_offset !== undefined) root.style.setProperty('--content-top-offset', `${settings.content_top_offset}px`);
    
    const headerHeight = settings.header_hoogte !== undefined ? settings.header_hoogte : settings.header_height;
    if (headerHeight !== undefined) root.style.setProperty('--header-height', `${headerHeight}px`);

    // Header transparency logic (v7.9+)
    const transparency = parseFloat(settings.header_transparantie !== undefined ? settings.header_transparantie : settings.header_transparent);
    if (!isNaN(transparency) && transparency > 0) {
      const opacity = 1 - transparency;
      // Use the header RGB color if available
      root.style.setProperty('--header-bg', `rgba(var(--color-header-rgb, 255, 255, 255), ${opacity})`);
      root.style.setProperty('--header-blur', transparency > 0.5 ? 'none' : 'blur(16px)');
      root.style.setProperty('--header-border', 'none');
    } else {
      root.style.removeProperty('--header-bg');
      root.style.removeProperty('--header-blur');
      root.style.removeProperty('--header-border');
    }

  }, [settings]);

  return null; // This component doesn't render anything
};

export default StyleInjector;
