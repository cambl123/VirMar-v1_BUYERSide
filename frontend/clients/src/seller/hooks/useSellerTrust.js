import { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/analyticsApi';
import useAuth from '../../hooks/useAuth';

const useSellerTrust = () => {
    const [trustScore, setTrustScore] = useState(0);
    const { token } = useAuth();

    useEffect(() => {
        const fetchTrustScore = async () => {
            if (token) {
                try {
                    const response = await analyticsApi.getTrustScore(token);
                    setTrustScore(response.data.trustScore);
                } catch (error) {
                    console.error('Failed to fetch trust score:', error);
                }
            }
        };
        fetchTrustScore();
    }, [token]);

    return { trustScore };
};

export default useSellerTrust;