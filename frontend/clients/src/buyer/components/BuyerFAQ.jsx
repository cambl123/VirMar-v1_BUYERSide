import React from 'react';
import {
  Box, Heading, Accordion, AccordionItem, AccordionButton,
  AccordionPanel, AccordionIcon, Text
} from '@chakra-ui/react';

const faqs = [
  {
    question: 'How do I make a purchase?',
    answer: 'Browse products, add them to cart, then proceed to checkout from your wallet.'
  },
  {
    question: 'How do I deposit money into my wallet?',
    answer: 'Go to your Wallet page, click Deposit, and follow MTN MoMo steps.'
  },
  {
    question: 'Can I cancel an order?',
    answer: 'Only before it’s confirmed by the seller. Contact support for help.'
  },
  {
    question: 'How do I contact a seller?',
    answer: 'Go to the product page and use the contact/chat option with the seller.'
  }
];

const BuyerFAQ = () => (
  <Box maxW="700px" mx="auto" mt={10} p={6}>
    <Heading size="lg" mb={6}>Frequently Asked Questions</Heading>
    <Accordion allowToggle>
      {faqs.map((faq, idx) => (
        <AccordionItem key={idx}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">{faq.question}</Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>{faq.answer}</Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
);

export default BuyerFAQ;
