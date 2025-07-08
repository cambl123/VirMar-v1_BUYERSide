import React from 'react';

const ItemCard = () => {
  return (
    <div className="item-card">
      <div className="item-image">
        <img src="https://via.placeholder.com/150" alt="Item Image" />
      </div>
      <div className="item-info">
        <h2>Item Title</h2>
        <p>Item Description</p>
        <p>Price: $19.99</p>
        <button className="add-to-cart">Add to Cart</button>
        <button className="view-details">View Details</button>
      </div>
    </div>
  );
};

export default ItemCard;