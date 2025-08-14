import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create root with concurrent features
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with StrictMode for better development experience
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);