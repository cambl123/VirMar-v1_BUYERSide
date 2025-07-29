import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

const currencies = ["USD", "EUR", "RWF", "GBP"];

const BudgetForm = () => {
  const [form, setForm] = useState({
    description: "",
    estimatedBudget: "",
    currency: "",
    phone: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = "Description is required";
    if (
      !form.estimatedBudget ||
      isNaN(form.estimatedBudget) ||
      Number(form.estimatedBudget) <= 0
    )
      errs.estimatedBudget = "Please enter a valid budget";
    if (!form.currency) errs.currency = "Currency is required";
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

    // TODO: submit budget request to backend
    toast({
      title: "Budget submitted",
      description: "Your budget request has been sent.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="600px" mx="auto" p={5} borderWidth={1} borderRadius="md">
      <Heading size="md" mb={4}>
        Submit Your Budget
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.description} mb={3} isRequired>
          <FormLabel>Project / Service Description</FormLabel>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your project or service request"
          />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.estimatedBudget} mb={3} isRequired>
          <FormLabel>Estimated Budget</FormLabel>
          <Input
            type="number"
            name="estimatedBudget"
            value={form.estimatedBudget}
            onChange={handleChange}
            placeholder="Enter your budget"
            min="0"
          />
          <FormErrorMessage>{errors.estimatedBudget}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.currency} mb={3} isRequired>
          <FormLabel>Currency</FormLabel>
          <Select name="currency" value={form.currency} onChange={handleChange}>
            <option value="">Select currency</option>
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.currency}</FormErrorMessage>
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
          <FormLabel>Deadline / Timeframe (optional)</FormLabel>
          <Input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" width="full">
          Submit Budget
        </Button>
      </form>
    </Box>
  );
};

export default BudgetForm;
