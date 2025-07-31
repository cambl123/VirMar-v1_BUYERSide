// src/buyer/hooks/useDepositFunds.js
import { useState } from "react";
import axios from "axios";

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
        "http://localhost:5000/api/transactions/deposit",
        { amount },
        { withCredentials: true } // send cookies if using sessions/auth
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
