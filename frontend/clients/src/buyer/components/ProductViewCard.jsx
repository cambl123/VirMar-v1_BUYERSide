import React from 'react';

const ProductViewCard = ({ product }) => {
    return (
        <div className="card">
            <div className="card-image">
                <figure className="image is-4by3">
                    <img src={product.imageUrl} alt={product.name} />
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className="title is-4">{product.name}</p>
                        <p className="subtitle is-6">@{product.seller}</p>
                    </div>
                </div>
                <div className="content">
                    {product.description}
                    <br />
                    <strong>Price: ${product.price}</strong>
                </div>
            </div>
        </div>
    );
};

export default ProductViewCard;