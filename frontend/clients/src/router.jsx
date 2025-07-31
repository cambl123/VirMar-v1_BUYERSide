import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicRouter from './public/Router';
import BuyerRouter from './buyer/Router';
import SellerContextWrapper from './seller/SellerContextWrapper';  // <-- use wrapper here
import NotFoundPage from './pages/NotFoundPage';

const MainRouter = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<PublicRouter />} />
      <Route path="/buyer/*" element={<BuyerRouter />} />
      <Route path="/seller/*" element={<SellerContextWrapper />} />  {/* context + routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default MainRouter;
