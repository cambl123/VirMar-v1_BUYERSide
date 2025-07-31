import React, { useState } from 'react';

const DepositWalletForm = () => {
    const [amount, setAmount] = useState('');

    const handleChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ amount });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="field">
                <label className="label">Amount</label>
                <div className="control">
                    <input
                        className="input"
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="field">
                <div className="control">
                    <button className="button is-primary">Deposit</button>
                </div>
            </div>
        </form>
    );
};

export default DepositWalletForm;