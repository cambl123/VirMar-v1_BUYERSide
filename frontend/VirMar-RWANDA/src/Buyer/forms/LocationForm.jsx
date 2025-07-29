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

const countries = ["Rwanda", "USA", "Canada", "UK", "Other"];

const LocationForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    landmark: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.country) errs.country = "Country is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.streetAddress.trim()) errs.streetAddress = "Street address is required";
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

    // TODO: submit location to backend
    toast({
      title: "Location saved",
      description: "Your address has been updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="500px" mx="auto" p={5} borderWidth={1} borderRadius="md">
      <Heading size="md" mb={4}>
        Set Your Location
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.fullName} mb={3} isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
          />
          <FormErrorMessage>{errors.fullName}</FormErrorMessage>
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

        <FormControl isInvalid={!!errors.country} mb={3} isRequired>
          <FormLabel>Country</FormLabel>
          <Select name="country" value={form.country} onChange={handleChange}>
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.country}</FormErrorMessage>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>State/Province</FormLabel>
          <Input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State or Province"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.city} mb={3} isRequired>
          <FormLabel>City</FormLabel>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
          />
          <FormErrorMessage>{errors.city}</FormErrorMessage>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Postal / ZIP Code</FormLabel>
          <Input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            placeholder="Postal or ZIP code"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.streetAddress} mb={3} isRequired>
          <FormLabel>Street Address</FormLabel>
          <Input
            name="streetAddress"
            value={form.streetAddress}
            onChange={handleChange}
            placeholder="Street address"
          />
          <FormErrorMessage>{errors.streetAddress}</FormErrorMessage>
        </FormControl>

        <FormControl mb={5}>
          <FormLabel>Landmark / Additional Info</FormLabel>
          <Input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="Optional landmark or directions"
          />
        </FormControl>

        <Button type="submit" colorScheme="green" width="full">
          Save Location
        </Button>
      </form>
    </Box>
  );
};

export default LocationForm;
