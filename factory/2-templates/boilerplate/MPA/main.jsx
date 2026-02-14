import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './style-import.css';

async function init() {
  const data = {};
  try {
    {{DATA_LOADING_LOGIC}}
  } catch (e) {
    console.error("Data laad fout:", e);
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App data={data} />
      </BrowserRouter>
    </React.StrictMode>
  );
}

init();
