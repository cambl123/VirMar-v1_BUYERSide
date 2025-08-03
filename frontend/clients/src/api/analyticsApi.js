import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const API_URL = `${API_BASE_URL}/api/analytics`  //'http://localhost:5000/api/analytics';
 
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