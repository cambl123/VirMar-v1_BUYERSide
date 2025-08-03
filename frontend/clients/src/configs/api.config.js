// apiConfig.js

// This variable will be set by Render in production
// and will default to localhost in development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';