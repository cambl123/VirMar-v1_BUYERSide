import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, DarkMode } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
