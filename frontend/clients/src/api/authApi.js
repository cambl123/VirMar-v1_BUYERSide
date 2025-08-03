import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const API_URL = `${API_BASE_URL}/api/auth`// 'http://localhost:5000/api/auth';

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