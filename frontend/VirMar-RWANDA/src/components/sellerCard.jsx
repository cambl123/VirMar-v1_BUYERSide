import React from 'react';

const SellerCard = () => {
  return (
    <div className="seller-card">
      <div className="seller-image">
        <img src="https://via.placeholder.com/150" alt="Seller Image" />
      </div>
      <div className="seller-info">
        <h2>Seller Name</h2>
        <p>Seller Description</p>
        <p>Rating: 4.5/5</p>
        <button className="view-profile">View Profile</button>
        <button className="contact-seller">Contact Seller</button>
      </div>
    </div>
  );
};

export default SellerCard;