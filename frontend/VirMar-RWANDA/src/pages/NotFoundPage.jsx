import React from 'react';
import './NotFoundPage.css';

/**
 * 404 Not Found Page – Dark theme with animated icon.
 */
const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="icon">😵‍💫</div>
      <h1 className="title">404 - Page Not Found</h1>
      <p className="message">Oops! We couldn’t find that page.</p>
      <a href="/" className="home-button">Go Back Home</a>
    </div>
  );
};

export default NotFoundPage;
