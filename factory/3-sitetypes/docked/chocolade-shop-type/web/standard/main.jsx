import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './modern.css';
import './dock-connector.js';

// Statische imports voor productie stabiliteit
import section_order from './data/section_order.json';
import layout_settings from './data/layout_settings.json';
import site_settings from './data/site_settings.json';
import section_settings from './data/section_settings.json';
import display_config from './data/display_config.json';
import basis from './data/basis.json';
import categorieen from './data/categorieen.json';
import producten from './data/producten.json';
import sterke_punten from './data/sterke_punten.json';
import style_config from './data/style_config.json';

const staticData = {
    section_order,
    layout_settings,
    site_settings,
    section_settings,
    display_config,
    basis,
    categorieen,
    producten,
    sterke_punten,
    style_config
};

async function init() {
  const data = { ...staticData };
  
  try {
    if (window.athenaScan) {
        window.athenaScan(data);
    }
  } catch (e) {
    console.error("Data scan fout:", e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();
