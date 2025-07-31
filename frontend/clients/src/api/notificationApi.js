import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const poll = (token) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const notificationApi = {
    poll,
};