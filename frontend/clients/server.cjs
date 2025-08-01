const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// The 'dist' directory is where Vite puts the final built files.
const staticPath = path.join(__dirname, 'dist');

// Serve static files from the 'dist' directory
app.use(express.static(staticPath));

// This is the key part: for any request that doesn't match a static file,
// serve the index.html file. This allows client-side routing to work.
// We use '/*splat' instead of '*' to satisfy newer versions of Express.
app.get('/*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Front-end server listening on port ${port}`);
});