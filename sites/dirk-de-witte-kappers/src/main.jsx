import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './classic.css';

async function init() {
  const data = {};
  // Dummy data loading logic for local development
  try {
    try { data.basisgegevens = (await import('./data/basisgegevens.json')).default; } catch (e) { console.warn("Mist basisgegevens.json"); }
    try { data.diensten = (await import('./data/diensten.json')).default; } catch (e) { console.warn("Mist diensten.json"); }
    try { data.team = (await import('./data/team.json')).default; } catch (e) { console.warn("Mist team.json"); }
    try { data.producten = (await import('./data/producten.json')).default; } catch (e) { console.warn("Mist producten.json"); }
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
