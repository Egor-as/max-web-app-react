import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Было: BrowserRouter
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter> {/* Было: BrowserRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>
);