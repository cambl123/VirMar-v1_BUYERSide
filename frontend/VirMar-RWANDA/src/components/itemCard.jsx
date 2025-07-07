import React from "react";

function ItemCard({ item }) {
  return (
    <div style={styles.card}>
      <h4>{item.name || "Unnamed Item"}</h4>
      <p>Price: {item.price || "N/A"}</p>
      <p>Category: {item.category || "General"}</p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    width: "200px",
    background: "#f9f9f9"
  }
};

export default ItemCard;
