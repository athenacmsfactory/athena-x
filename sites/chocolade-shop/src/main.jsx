import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './modern.css';
import './dock-connector.js';

async function init() {
  const data = {};
  // Dynamic data loading for robustness
  try {
    const dataModules = import.meta.glob('./data/*.json', { eager: true });
    const getData = (name) => {
        const key = Object.keys(dataModules).find(k => k.toLowerCase().endsWith(`/${name.toLowerCase()}.json`));
        return key ? dataModules[key].default : null;
    };
    
    // Load standard sections
    data['section_order'] = getData('section_order') || [];
    data['site_settings'] = getData('site_settings') || {};
    data['display_config'] = getData('display_config') || { sections: {} };
    data['layout_settings'] = getData('layout_settings') || {};
    data['style_config'] = getData('style_config') || {};
    data['section_settings'] = getData('section_settings') || {};
    data['style_bindings'] = getData('style_bindings') || {};

    // Load all other data files automatically based on section_order
    for (const sectionName of data['section_order']) {
        const sectionData = getData(sectionName);
        if (sectionData) {
            data[sectionName] = Array.isArray(sectionData) ? sectionData : [sectionData];
        }
    }

    // Fallback for specific hardcoded tables if they are not in section_order
    ['basisgegevens', 'categorieen', 'producten', 'sterke_punten'].forEach(table => {
        if (!data[table]) {
            const tableData = getData(table);
            if (tableData) data[table] = Array.isArray(tableData) ? tableData : [tableData];
        }
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