import React from 'react';

const EscrowConfirmationForm = () => {
    const handleConfirm = () => {
        // Handle confirmation logic here
        console.log('Escrow confirmed');
    };

    return (
        <div>
            <h1>Confirm Escrow Payment</h1>
            <p>Are you sure you want to release the funds to the seller?</p>
            <button className="button is-primary" onClick={handleConfirm}>
                Confirm
            </button>
        </div>
    );
};

export default EscrowConfirmationForm;