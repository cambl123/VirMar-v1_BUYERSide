import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

const EscrowConfirmationForm = ({ transactionId }) => {
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!phone.trim()) errs.phone = "Phone number is required";
    if (!agreed) errs.agreed = "You must agree to terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: submit data to backend
    toast({
      title: "Escrow confirmed",
      description: "Thank you for confirming escrow.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="400px" mx="auto" p={5} borderWidth={1} borderRadius="md">
      <Heading size="md" mb={4}>
        Escrow Confirmation
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3}>
          <FormLabel>Transaction ID</FormLabel>
          <Input value={transactionId || ""} isReadOnly />
        </FormControl>
        <FormControl isInvalid={!!errors.phone} mb={3} isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.agreed} mb={5} isRequired>
          <Checkbox
            isChecked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          >
            I agree to the terms and conditions
          </Checkbox>
          <FormErrorMessage>{errors.agreed}</FormErrorMessage>
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          Confirm Escrow
        </Button>
      </form>
    </Box>
  );
};

export default EscrowConfirmationForm;
