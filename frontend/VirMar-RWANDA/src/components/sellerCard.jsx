import React from "react";

function SellerCard({ seller }) {
  return (
    <div style={styles.card}>
      <h3>{seller.name || "Unnamed Seller"}</h3>
      <p>Email: {seller.email}</p>
      <p>Location: {seller.location || "Unknown"}</p>
      <p>Status: {seller.isActive ? "Active" : "Inactive"}</p>
        <p>Rating: {seller.rating || "No rating"}</p>
        <p>Items: {seller.items ? seller.items.length : 0}</p>

    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    width: "250px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }
};

export default SellerCard;
