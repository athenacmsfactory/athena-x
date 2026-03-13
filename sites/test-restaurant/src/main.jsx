import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const dataFiles = import.meta.glob('./data/*.json', { eager: true });
const siteData = {};

Object.keys(dataFiles).forEach(path => {
  const fileName = path.split('/').pop().replace('.json', '');
  const data = dataFiles[path].default || dataFiles[path];
  // Altijd lowercase key gebruiken voor consistentie
  siteData[fileName.toLowerCase()] = data;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App data={siteData} />
  </React.StrictMode>,
)