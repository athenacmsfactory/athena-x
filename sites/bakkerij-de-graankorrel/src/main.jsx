import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const dataFiles = import.meta.glob('./data/*.json', { eager: true });
const siteData = {};

Object.keys(dataFiles).forEach(path => {
  const fileName = path.split('/').pop().replace('.json', '');
  const key = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  siteData[key] = dataFiles[path].default || dataFiles[path];
  siteData[fileName] = dataFiles[path].default || dataFiles[path];
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App data={siteData} />
  </React.StrictMode>,
)