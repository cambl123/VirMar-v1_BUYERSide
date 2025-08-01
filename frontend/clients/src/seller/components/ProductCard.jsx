import React from 'react';
import './Product.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price}</p>
      <p className="product-description">{product.description}</p>

      <div className="product-actions">
        <button className="btn btn-edit" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
