import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './modern.css';
import './dock-connector.js';

async function init() {
  const data = {};
  // Dummy data loading logic for local development
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
    data['site_settings'] = getData('site_settings') || {};
    data['section_settings'] = getData('section_settings') || [];
    data['display_config'] = getData('display_config') || { sections: {} };
    data['style_bindings'] = getData('style_bindings') || {};
    
    // Data-secties laden
    for (const sectionName of data['section_order']) {
        const sectionData = getData(sectionName);
        if (sectionData) {
            data[sectionName] = Array.isArray(sectionData) ? sectionData : [sectionData];
            totalRows += Array.isArray(sectionData) ? sectionData.length : 1;
        } else {
            data[sectionName] = []; 
        }
    }

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

  // Trigger scan after render
  setTimeout(() => {
    if (window.athenaScan) window.athenaScan(data);
  }, 100);
}

init();
