// src/router.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import react from "react"
import LandingPage from './public/pages/LandingPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<LandingPage />} />
        {/* Seller and Public routes later */}
      </Routes>
    </BrowserRouter>
  );
}


export default AppRouter