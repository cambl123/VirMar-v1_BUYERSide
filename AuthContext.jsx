import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('virmar_token'));
  const [isLoading, setIsLoading] = useState(true);

  axios.defaults.withCredentials = true; // Ensure cookies are sent with every request

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user profile
      axios.get('http://localhost:5000/api/public/Info')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token is invalid
          localStorage.removeItem('virmar_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (apiUrl, credentials) => {
    const response = await axios.post(apiUrl, credentials);
    const { token: newToken, buyer, seller } = response.data;
    const loggedInUser = buyer || seller;

    localStorage.setItem('virmar_token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return loggedInUser;
  };

  const logout = () => {
    // Call backend logout if it exists to clear httpOnly cookie
    // axios.get('http://localhost:5000/api/buyer/logout'); 
    localStorage.removeItem('virmar_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
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