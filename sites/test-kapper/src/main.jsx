import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Dynamisch alle JSON bestanden in de data map laden
const dataFiles = import.meta.glob('./data/*.json', { eager: true });
const siteData = {};

Object.keys(dataFiles).forEach(path => {
  const fileName = path.split('/').pop().replace('.json', '');
  // Maak zowel Case-Sensitive als lowercase keys beschikbaar voor maximale compatibiliteit
  const key = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  const data = dataFiles[path].default || dataFiles[path];
  
  siteData[key] = data;
  siteData[fileName] = data;
  siteData[fileName.toLowerCase()] = data;
});

console.log('📦 Athena Data Loaded:', Object.keys(siteData));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App data={siteData} />
  </React.StrictMode>,
)
