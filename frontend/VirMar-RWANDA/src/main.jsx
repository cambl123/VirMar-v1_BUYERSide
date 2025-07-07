// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './app';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// // This is the main entry point for the VirMar-RWANDA frontend application, rendering the App component into the root element.
// // It also imports global styles from index.css to apply consistent styling across the application.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// This code initializes the React application by rendering the App component into the root element of the HTML document.
// It uses React.StrictMode to help identify potential problems in the application during development.
