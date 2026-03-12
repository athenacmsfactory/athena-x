import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './classic.css';

async function init() {
  const data = {};
  
  // Dynamically load all JSON files from the data directory
  const dataFiles = import.meta.glob('./data/*.json', { eager: true });
  
  Object.keys(dataFiles).forEach(path => {
    const fileName = path.split('/').pop().replace('.json', '');
    data[fileName] = dataFiles[path].default || dataFiles[path];
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

init();
