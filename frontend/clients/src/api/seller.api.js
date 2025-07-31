import axios from "axios";

const API_BASE = "http://localhost:5000/api/seller";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Auth & Profile
export const registerSeller = (data) => api.post("/register", data);
export const loginSeller = (data) => api.post("/login", data);
export const logoutSeller = () => api.get("/logout");
export const fetchSellerProfile = () => api.get("/profile");

// Items CRUD
export const addItemToStore = (storeId, itemData) =>
  api.post(`/store/${storeId}/item`, itemData);

export const fetchStoreItems = (storeId) =>
  api.get(`/store/${storeId}/items`);

export const updateItemById = (itemId, updateData) =>
  api.patch(`/item/${itemId}`, updateData);

export const deleteItemById = (itemId) =>
  api.delete(`/item/${itemId}`);

export default {
  registerSeller,
  loginSeller,
  logoutSeller,
  fetchSellerProfile,
  addItemToStore,
  fetchStoreItems,
  updateItemById,
  deleteItemById,
};
