import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const API_URL = `${API_BASE_URL}/api/notifications`//'http://localhost:5000/api/notifications';

const poll = (token) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const notificationApi = {
    poll,
};