import { useState, useEffect } from 'react';
import { walletApi } from '../../api/walletApi';
import useAuth from '../../hooks/useAuth';

const useBuyerWallet = () => {
    const [balance, setBalance] = useState(0);
    const { token } = useAuth();

    useEffect(() => {
        const fetchBalance = async () => {
            if (token) {
                try {
                    const response = await walletApi.getBalance(token);
                    setBalance(response.data.balance);
                } catch (error) {
                    console.error('Failed to fetch balance:', error);
                }
            }
        };
        fetchBalance();
    }, [token]);

    const deposit = async (amount) => {
        try {
            const response = await walletApi.deposit(amount, token);
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Deposit failed:', error);
        }
    };

    return { balance, deposit };
};

export default useBuyerWallet;