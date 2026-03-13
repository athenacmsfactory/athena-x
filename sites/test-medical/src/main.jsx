import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './modern.css';

async function init() {
  const data = {};
  // Dummy data loading logic for local development
  try {
    let totalRows = 0;
    try { 
        // Forceer lowercase keys voor consistentie in de frontend
        const tableData = (await import('./data/praktijk_info.json')).default;
        data['praktijk_info'] = tableData;
        if (Array.isArray(tableData)) totalRows += tableData.length;
    } catch (e) { console.warn("Mist praktijk_info.json"); }
    try { 
        // Forceer lowercase keys voor consistentie in de frontend
        const tableData = (await import('./data/specialisaties.json')).default;
        data['specialisaties'] = tableData;
        if (Array.isArray(tableData)) totalRows += tableData.length;
    } catch (e) { console.warn("Mist specialisaties.json"); }
    try { 
        // Forceer lowercase keys voor consistentie in de frontend
        const tableData = (await import('./data/artsen.json')).default;
        data['artsen'] = tableData;
        if (Array.isArray(tableData)) totalRows += tableData.length;
    } catch (e) { console.warn("Mist artsen.json"); }
    try { 
        // Forceer lowercase keys voor consistentie in de frontend
        const tableData = (await import('./data/info.json')).default;
        data['info'] = tableData;
        if (Array.isArray(tableData)) totalRows += tableData.length;
    } catch (e) { console.warn("Mist info.json"); }
    if (import.meta.env.DEV && totalRows === 0) {
        const banner = document.createElement('div');
        banner.style.cssText = "position:fixed;top:0;left:0;right:0;background:#f59e0b;color:white;text-align:center;padding:8px;font-size:12px;z-index:9999;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.1);";
        banner.innerHTML = "⚠️ GEEN DATA GEVONDEN! Gebruik Optie [8] TSV to Sites in het Dashboard of koppel een Google Sheet.";
        document.body.appendChild(banner);
        document.body.style.paddingTop = "40px";
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