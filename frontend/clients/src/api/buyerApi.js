import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const API_BASE_URL = `${API_BASE_URL}/api/buyer`//'http://localhost:5000/api/buyer';

export const registerBuyer = (data) => {
  return axios.post(`${API_BASE_URL}/register`, data, { withCredentials: true });
};

export const loginBuyer = (data) => {
  return axios.post(`${API_BASE_URL}/login`, data, { withCredentials: true });
};

export const fetchBuyerProfile = () => {
  return axios.get(`${API_BASE_URL}/profile`, { withCredentials: true });
};

export const updateBuyerProfile = (data) => {
  return axios.put(`${API_BASE_URL}/profile`, data, { withCredentials: true });
};

export const fetchBuyerWallet = () => {
  return axios.get(`${API_BASE_URL}/wallet`, { withCredentials: true });
};

export const fetchEscrowDetails = (transactionId) => {
  return axios.get(`${API_BASE_URL}/escrow/${transactionId}`, { withCredentials: true });
};

export const searchProducts = (query) => {
  return axios.get(`${API_BASE_URL}/products/search`, { 
    params: { q: query },
    withCredentials: true 
  });
};

export const fetchProductDetails = (productId) => {
  return axios.get(`${API_BASE_URL}/products/${productId}`, { withCredentials: true });
};
