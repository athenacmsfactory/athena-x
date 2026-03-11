import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './classic.css';

async function init() {
  const data = {};
  let totalRows = 0;

  // Dummy data loading logic for local development
  try {
    const tables = ['academy_info', 'cursussen', 'docenten', 'reviews'];
    for (const table of tables) {
      try {
        const tableData = (await import(`./data/${table}.json`)).default;
        // We slaan ze op met de originele CamelCase key voor de App component
        const camelKey = table.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
        data[camelKey] = tableData;
        if (Array.isArray(tableData)) totalRows += tableData.length;
      } catch (e) {
        console.warn(`Mist ${table}.json`);
      }
    }
  } catch (e) {
    console.error("Data laad fout:", e);
  }

  if (import.meta.env.DEV && totalRows === 0) {
      const banner = document.createElement('div');
      banner.style.cssText = "position:fixed;top:0;left:0;right:0;background:#f59e0b;color:white;text-align:center;padding:8px;font-size:12px;z-index:9999;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.1);font-family:sans-serif;";
      banner.innerHTML = "⚠️ GEEN DATA GEVONDEN! Gebruik Optie [8] Data Injector in het Dashboard of koppel een Google Sheet.";
      document.body.appendChild(banner);
      document.body.style.paddingTop = "40px";
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();
