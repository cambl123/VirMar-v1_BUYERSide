const express = require('express');
const path = require('path');
const fallback = require('express-history-api-fallback');

const app = express();
const port = process.env.PORT || 3000;

// The 'dist' directory is where Vite puts the final built files.
const root = path.join(__dirname, 'dist');

// Serve static files from the 'dist' directory
app.use(express.static(root));

// This middleware handles the routing fallback.
// It serves index.html for any request that doesn't match a static file.
app.use(fallback('index.html', { root }));

app.listen(port, () => {
  console.log(`Front-end server listening on port ${port}`);
});