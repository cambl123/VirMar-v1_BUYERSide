import axios from 'axios';

const API_URL = 'http://localhost:5000/api/wallet';

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