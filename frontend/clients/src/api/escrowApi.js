import axios from 'axios';

const API_URL = 'http://localhost:5000/api/escrow';

const start = (productId, amount, token) => {
    return axios.post(
        `${API_URL}/start`,
        { productId, amount },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

const confirm = (escrowId, token) => {
    return axios.post(
        `${API_URL}/confirm`,
        { escrowId },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

const release = (escrowId, token) => {
    return axios.post(
        `${API_URL}/release`,
        { escrowId },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const escrowApi = {
    start,
    confirm,
    release,
};