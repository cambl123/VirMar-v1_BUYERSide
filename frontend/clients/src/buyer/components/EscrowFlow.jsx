import React from 'react';
import {
  Box,
  Heading,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  useSteps,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Button,
} from '@chakra-ui/react';

const steps = [
  { title: 'Agreement', description: 'Buyer and Seller agree to terms' },
  { title: 'Funding', description: 'Buyer deposits funds' },
  { title: 'Delivery', description: 'Seller delivers goods/services' },
  { title: 'Inspection', description: 'Buyer inspects and approves' },
  { title: 'Payment', description: 'Seller receives funds' },
];

const EscrowFlow = () => {
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  return (
    <Box p="5">
      <Heading as="h1" mb="5">
        Escrow Transaction Details
      </Heading>
      <Card>
        <CardHeader>
          <Heading size="md">Transaction ID: #12345</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Product
              </Heading>
              <Text pt="2" fontSize="sm">
                Iphone 15 pro
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Amount
              </Heading>
              <Text pt="2" fontSize="sm">
                1,500,000 RWF
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
      <Stepper index={activeStep} mt={10}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
          </Step>
        ))}
      </Stepper>
      <Stack direction="row" mt={10} spacing={4} align="center">
        <Button
          onClick={() => setActiveStep(activeStep - 1)}
          isDisabled={activeStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          isDisabled={activeStep === steps.length - 1}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default EscrowFlow;