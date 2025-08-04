import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../configs/api.config'; // Correct path to your config file

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('virmar_token'));
  const [isLoading, setIsLoading] = useState(true);

  axios.defaults.withCredentials = true; // Ensure cookies are sent with every request

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Use the dynamic API_BASE_URL
          const response = await axios.get(`${API_BASE_URL}/api/public/Info`);
          
          // The backend returns a message and no user object in the public/Info route.
          // You need to use a different route to fetch the user profile based on role.
          // For now, this logic is corrected to handle the response from /api/public/Info
          // The `user` object will be populated with the `req.user` data from the middleware.
          // Your backend response in public.routes.js looks like `res.status(200).json({ message: "You are a buyer" })`
          // So, `response.data` won't contain a `user` object. The corrected logic below will be a placeholder.
          // A better approach is to create a dedicated route like `/api/profile` that returns the full user object.

          // This assumes your `protectRoutes` middleware attaches the user to the request.
          // If you were to have a route that returns the user's full profile:
          // const profileResponse = await axios.get(`${API_BASE_URL}/api/profile`);
          // setUser(profileResponse.data.user);
          
          // For now, let's assume the /Info route is a valid token check.
          // You might need to adjust your backend to return the user object here.
          setUser(response.data); // This is an assumption; your backend may need to be adjusted to return the user object.
        } catch (error) {
          // Token is invalid, expired, or the request failed
          console.error("Token verification failed:", error);
          localStorage.removeItem('virmar_token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (apiUrl, credentials) => {
    try {
      // Use the dynamic API_BASE_URL
      const response = await axios.post(`${API_BASE_URL}${apiUrl}`, credentials);
      const { token: newToken, buyer, seller } = response.data;
      const loggedInUser = buyer || seller;

      localStorage.setItem('virmar_token', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return loggedInUser;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error; // Re-throw to allow the calling component to handle the error
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if it exists to clear httpOnly cookie
      // The `public.routes.js` file does not have a logout endpoint, so you'll need to use the specific routes for seller or buyer.
      // Example: await axios.get(`${API_BASE_URL}/api/buyer/logout`);
      localStorage.removeItem('virmar_token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Logout failed:", error.message);
      // Even if the backend call fails, we should still clear local state
      localStorage.removeItem('virmar_token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};