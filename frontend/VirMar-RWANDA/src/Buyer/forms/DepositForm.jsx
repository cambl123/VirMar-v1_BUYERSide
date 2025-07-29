import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer"];

const DepositForm = () => {
  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "",
    phone: "",
    transactionRef: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = "Please enter a valid amount";
    if (!form.paymentMethod) errs.paymentMethod = "Select a payment method";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: integrate with backend deposit API
    toast({
      title: "Deposit submitted",
      description: `Amount: ${form.amount} via ${form.paymentMethod}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="400px" mx="auto" p={5} borderWidth={1} borderRadius="md">
      <Heading size="md" mb={4}>
        Deposit Funds
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.amount} mb={3} isRequired>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="0"
          />
          <FormErrorMessage>{errors.amount}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.paymentMethod} mb={3} isRequired>
          <FormLabel>Payment Method</FormLabel>
          <Select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select payment method</option>
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.phone} mb={3} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        <FormControl mb={5}>
          <FormLabel>Transaction Reference (optional)</FormLabel>
          <Input
            name="transactionRef"
            value={form.transactionRef}
            onChange={handleChange}
            placeholder="Transaction ID or reference"
          />
        </FormControl>

        <Button type="submit" colorScheme="purple" width="full">
          Submit Deposit
        </Button>
      </form>
    </Box>
  );
};

export default DepositForm;
