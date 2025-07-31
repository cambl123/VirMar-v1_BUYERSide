// src/shared/escrow/useEscrowStatus.js
import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Hook to fetch escrow status for a given order ID.
 *
 *  //@param {string} orderId - The ID of the order to check escrow status.
 * //@returns {{
 *   // status: "loading" | "error" | string,
 *   // error: string | null
 * }}
 */
const useEscrowStatus = (orderId) => {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(
          `/api/public/escrow/status/${orderId}`,
          { withCredentials: true }
        );
        setStatus(data.status); // Example: "held", "released", "cancelled"
      } catch (err) {
        console.error("Error fetching escrow status:", err);
        setError("Failed to fetch escrow status");
        setStatus("error");
      }
    };

    fetchStatus();
  }, [orderId]);

  return { status, error };
};

export default useEscrowStatus;
