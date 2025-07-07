import React, { useEffect, useState } from "react";
import axios from "axios";
import SellerCard from "./components/sellerCard.jsx";
import ItemCard from "./components/itemCard.jsx";
import LoginForm from "./components/LoginForm.jsx";

function App() {
  const [sellers, setSellers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/") // Replace with your backend URL
      .then((res) => {
        setSellers(res.data.sellers);
        setItems(res.data.items);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Featured Sellers</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {sellers.map((seller, idx) => (
          <SellerCard key={idx} seller={seller} />
        ))}
      </div>

      <h2 style={{ marginTop: "2rem" }}>Random Items</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {items.map((item, idx) => (
          <ItemCard key={idx} item={item} />
        ))}
      </div>
      <h2 style={{ marginTop: "2rem" }}>Login</h2>
      <LoginForm onLogin={(data) => console.log("Logged in:", data)} />
      <p style={{ marginTop: "2rem" }}>
        This is a simple e-commerce platform showcasing sellers and their items.
        Feel free to explore!
      </p>
    </div>
  );
}

export default App;
