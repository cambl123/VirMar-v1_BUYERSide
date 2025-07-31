import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';
 
const getTrustScore = (token) => {
    return axios.get(`${API_URL}/trust-score`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const getDemand = (token) => {
    return axios.get(`${API_URL}/demand`, { 
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const analyticsApi = {
    getTrustScore,
    getDemand,
};