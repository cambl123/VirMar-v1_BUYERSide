import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

const getAll = () => {
    return axios.get(API_URL);
};

const getOne = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const create = (product, token) => {
    return axios.post(API_URL, product, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const update = (id, product, token) => {
    return axios.put(`${API_URL}/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

const remove = (id, token) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const productApi = {
    getAll,
    getOne,
    create,
    update,
    remove,
};