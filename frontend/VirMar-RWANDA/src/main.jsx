// index.js

import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx"; // Make sure your file is named 'App.js' with a capital A
import "./index.css"


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<StrictMode>
    <App />
</StrictMode>
    
  
);
