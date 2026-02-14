import React, { useEffect } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import DesignControls from './components/DesignControls';

/**
 * App component gegenereerd door Athena Standard Engine
 */
const App = ({ data }) => {
  if (!data) return <div className="p-10">Laden...</div>;
  const settings = data.site_settings?.[0] || {};

  // Persistente toepassing van thema en kleuren
  useEffect(() => {
    const root = document.documentElement;
    
    // Light mode variabelen
    root.style.setProperty('--primary-color-light', settings.light_primary_color || '#0f172a');
    root.style.setProperty('--accent-color-light', settings.light_accent_color || '#3b82f6');
    root.style.setProperty('--bg-site-light', settings.light_bg_color || '#ffffff');
    root.style.setProperty('--text-color-light', settings.light_text_color || '#0f172a');

    // Dark mode variabelen
    root.style.setProperty('--primary-color-dark', settings.dark_primary_color || '#ffffff');
    root.style.setProperty('--accent-color-dark', settings.dark_accent_color || '#60a5fa');
    root.style.setProperty('--bg-site-dark', settings.dark_bg_color || '#0f172a');
    root.style.setProperty('--text-color-dark', settings.dark_text_color || '#f8fafc');

    // Thema voorkeur (User preference > Default setting)
    const userTheme = localStorage.getItem('theme');
    const defaultTheme = settings.theme || 'light';
    
    if (userTheme === 'dark' || (!userTheme && defaultTheme === 'dark')) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [data]);

  return (
    <div className="min-h-screen transition-colors duration-500">
      <DesignControls settings={settings} />
      <Header data={data} />
      <main>
        <Section data={data} />
      </main>
      <footer className="p-10 text-center border-t text-sm opacity-50" style={{ borderTopColor: 'var(--accent-color)', color: 'var(--text-color)' }}>
        &copy; {new Date().getFullYear()} - Gebouwd met Athena CMS
      </footer>
    </div>
  );
};

export default App;