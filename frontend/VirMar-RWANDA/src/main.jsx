import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// This is the main entry point for the VirMar-RWANDA frontend application, rendering the App component into the root element.
// It also imports global styles from index.css to apply consistent styling across the application.