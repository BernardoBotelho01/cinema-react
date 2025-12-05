import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';  // Importação correta do CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Importação correta do JavaScript
import 'bootstrap-icons/font/bootstrap-icons.css';  // Importação dos ícones Bootstrap

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
