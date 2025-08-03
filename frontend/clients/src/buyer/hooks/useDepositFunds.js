// src/buyer/hooks/useDepositFunds.js
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../configs/api.config"; // Adjust the import path as necessary

const useDepositFunds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const depositFunds = async (amount) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await axios.post(
        // Corrected URL: using API_BASE_URL and the correct path /api/transact/deposit
        `${API_BASE_URL}/api/transact/deposit`,
        { amount },
        { withCredentials: true }
      );
      setSuccessMsg(response.data.message);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error depositing funds");
      setLoading(false);
    }
  };

  return { depositFunds, loading, error, successMsg };
};

export default useDepositFunds;