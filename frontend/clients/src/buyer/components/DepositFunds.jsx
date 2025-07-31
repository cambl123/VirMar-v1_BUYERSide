// src/buyer/components/DepositFunds.jsx
import React, { useState } from "react";
import { Box, Button, Input, Text, Spinner } from "@chakra-ui/react";
import useDepositFunds from "../hooks/useDepositFunds";

const DepositFunds = () => {
  const [amount, setAmount] = useState( "" );
  const { depositFunds, loading, error, successMsg } = useDepositFunds();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }
    await depositFunds(numAmount);
    setAmount("");
  };

  return (
    <Box maxW="400px" mx="auto" mt="8" p="4" borderWidth="1px" borderRadius="md" boxShadow="md">
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          placeholder="Enter amount to deposit"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          mb="4"
          min="0"
          step="0.01"
        />
        <Button type="submit" colorScheme="blue" isFullWidth={true} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Deposit Funds"}
        </Button>
      </form>

      {error && <Text mt="4" color="red.500">{error}</Text>}
      {successMsg && <Text mt="4" color="green.500">{successMsg}</Text>}
    </Box> 
  );
};

export default DepositFunds;
