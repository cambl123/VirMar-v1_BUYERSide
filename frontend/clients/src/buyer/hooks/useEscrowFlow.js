import { useState } from 'react';
import { escrowApi } from '../../api/escrowApi';
import useAuth from '../../hooks/useAuth';

const useEscrowFlow = () => {
    const [escrowState, setEscrowState] = useState('idle');
    const { token } = useAuth();

    const startEscrow = async (productId, amount) => {
        try {
            setEscrowState('pending');
            await escrowApi.start(productId, amount, token);
            setEscrowState('started');
        } catch (error) {
            console.error('Failed to start escrow:', error);
            setEscrowState('error');
        }
    };

    const confirmEscrow = async (escrowId) => {
        try {
            setEscrowState('confirming');
            await escrowApi.confirm(escrowId, token);
            setEscrowState('confirmed');
        } catch (error) {
            console.error('Failed to confirm escrow:', error);
            setEscrowState('error');
        }
    };

    const releaseEscrow = async (escrowId) => {
        try {
            setEscrowState('releasing');
            await escrowApi.release(escrowId, token);
            setEscrowState('released');
        } catch (error) {
            console.error('Failed to release escrow:', error);
            setEscrowState('error');
        }
    };

    return { escrowState, startEscrow, confirmEscrow, releaseEscrow };
};

export default useEscrowFlow;