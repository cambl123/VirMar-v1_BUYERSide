import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
const API_URL = `${API_BASE_URL}/api/wallet`//'http://localhost:5000/api/wallet';

const getBalance = (token) => {
    return axios.get(`${API_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const deposit = (amount, token) => {
    return axios.post(
        `${API_URL}/deposit`,
        { amount },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const walletApi = {
    getBalance,
    deposit,
};