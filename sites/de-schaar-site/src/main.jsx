import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './modern.css';
import './dock-connector.jsx';

async function init() {
  const data = {};
  
  try {
    // 🔥 Robuuste Data Loading via Vite Glob (Werkt in Dev & Prod/GitHub Pages)
    const dataModules = import.meta.glob('./data/*.json', { eager: true });
    
    const getData = (name) => {
        const key = Object.keys(dataModules).find(k => k.toLowerCase().endsWith(`/${name.toLowerCase()}.json`));
        return key ? dataModules[key].default : null;
    };

    let totalRows = 0;
    
    // Systeembestanden
    data['section_order'] = getData('section_order') || [];
    data['layout_settings'] = getData('layout_settings') || {};
    data['hero'] = getData('hero') || {};
    data['header_settings'] = getData('header_settings') || {};
    data['section_settings'] = getData('section_settings') || [];
    data['display_config'] = getData('display_config') || { sections: {} };
    data['style_bindings'] = getData('style_bindings') || {};
    
    // 🔥 Dynamisch ALLE JSON bestanden laden in het data object
    Object.keys(dataModules).forEach(path => {
        const name = path.split('/').pop().replace('.json', '');
        const content = dataModules[path].default;
        
        // Alleen laden als het nog niet geladen is als systeembestand
        if (!data[name]) {
            // Forceer GEEN array voor config bestanden
            const isConfig = name.includes('settings') || name.includes('config') || name === 'hero';
            data[name] = (Array.isArray(content) || isConfig) ? content : [content];
        } else if (Array.isArray(data[name]) && data[name].length === 0 && content) {
            data[name] = Array.isArray(content) ? content : [content];
        }
    });

    // Statistieken bijhouden
    Object.keys(data).forEach(k => {
        if (Array.isArray(data[k])) totalRows += data[k].length;
    });

    if (window.athenaScan) {
        window.athenaScan(data);
    }
    
  } catch (e) {
    console.error("Data laad fout:", e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();
