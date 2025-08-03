import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../configs/api.config"; // Adjust path as needed

// Create Context (must come before hook)
const SellerContext = createContext(null);

// Hook to use context
export const useSeller = () => {
  return useContext(SellerContext);
};

// Provider Component
export const SellerProvider = ({ children }) => {
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Create axios instance with cookies
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  // -------------------
  // AUTH METHODS
  // -------------------
  const register = async (registerData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/seller/register", registerData);
      setSeller(res.data.seller);
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/seller/login", { email, password });
      setSeller(res.data.seller);
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/seller/logout");
      setSeller(null);
      navigate("/seller/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/seller/profile");
      setSeller(res.data);
    } catch {
      setSeller(null);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  }, [axiosInstance]);

  const updateProfile = async (updateData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put("/api/seller/profile", updateData);
      setSeller(res.data);
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // STORE ITEMS
  // -------------------
  const fetchStoreItems = async (storeId) => {
    if (!storeId) throw new Error("No storeId provided");
    try {
      const res = await axiosInstance.get(`/api/seller/store/${storeId}/items`);
      return res.data.items || [];
    } catch (error) {
      throw error;
    }
  };

  // -------------------
  // ANALYTICS
  // -------------------
  const fetchBuyerTrends = async (filters) =>
    axiosInstance.get("/api/analytics/buyer-trends", { params: filters }).then((res) => res.data);

  const fetchSummaryMetrics = async (filters) =>
    axiosInstance.get("/api/analytics/summary", { params: filters }).then((res) => res.data);

  const fetchMarketStats = async (filters) =>
    axiosInstance.get("/api/analytics/market-conditions", { params: filters }).then((res) => res.data);

  const fetchCompetitiveData = async (filters) =>
    axiosInstance.get("/api/analytics/competitive", { params: filters }).then((res) => res.data);

  const fetchTrendingProducts = async (filters) =>
    axiosInstance.get("/api/analytics/trending-products", { params: filters }).then((res) => res.data);

  // Run once on component mount to check if user is logged in
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <SellerContext.Provider
      value={{
        seller,
        loading,
        authLoading,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
        fetchStoreItems,
        fetchBuyerTrends,
        fetchSummaryMetrics,
        fetchMarketStats,
        fetchCompetitiveData,
        fetchTrendingProducts,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};