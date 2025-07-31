import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = (username, email, password, role) => {
    return axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        role,
    });
};

const login = (email, password, role) => {
    return axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
    });
};

export const authApi = {
    register,
    login,
};