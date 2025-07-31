import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // You would typically decode the token to get user info
            // For now, we'll just set a dummy user
            setUser({ username: 'testuser' });
        }
    }, [token]);

    const login = async (email, password, role) => {
        try {
            const response = await authApi.login(email, password, role);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return { user, token, login, logout };
};

export default useAuth;