

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ItemCard from "./components/itemCard.jsx";
import SellerCard from "./components/SellerCard.jsx";
import Blog from "./pages/Blog.jsx";
import LoginForm from "./components/LoginForm.jsx";
import './index.css'

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/seller/login",
        credentials
      );
      setToken(response.data.token);
      setUser(response.data.seller);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard user={user} token={token} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
