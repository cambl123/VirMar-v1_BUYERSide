import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const subscriptionKey = process.env.MTNSUBSCRIPTIONKEY;
const apiUser = process.env.MTNAPIUSER;
const apiKey = process.env.MTNAPIKEY;
const targetEnvironment = 'sandbox';

if (!subscriptionKey || !apiUser || !apiKey) {
  throw new Error('Missing MTN credentials in environment variables');
}

let accessToken = null;
let tokenExpiry = 0;

// 🔑 Generate Access Token
async function getAccessToken() {
  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');
  const url = 'https://sandbox.momodeveloper.mtn.com/collection/token/';

  try {
    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'X-Target-Environment': targetEnvironment,
      },
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + 3600 * 1000; // 1 hour validity
    console.log('🔐 MoMo access token refreshed');
    return accessToken;
  } catch (error) {
    console.error('❌ Token fetch failed:', error.response?.data || error.message);
    return null;
  }
}

// 🔁 Refresh Token if Expired
async function refreshTokenIfNeeded() {
  if (!accessToken || Date.now() >= tokenExpiry) {
    await getAccessToken();
  }
  return accessToken;
}

// 💰 Check Account Balance
async function checkBalance() {
  const token = await refreshTokenIfNeeded();
  if (!token) throw new Error('Token fetch failed');

  const url = 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/account/balance';
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Target-Environment': targetEnvironment,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  };

  try {
    const response = await axios.post(url, {}, config);
    return response.data;
  } catch (error) {
    console.error('💸 Balance check failed:', error.response?.data || error.message);
    throw error;
  }
}

// 📥 Initiate Payment
async function initiatePayment(partyId, externalId, amount, currency = 'EUR') {
  const token = await refreshTokenIfNeeded();
  if (!token) throw new Error('Token fetch failed');

  const referenceId = uuidv4();
  const body = {
    amount,
    currency,
    externalId,
    payer: {
      partyIdType: 'MSISDN',
      partyId,
    },
    payerMessage: 'Payment initiated',
    payeeNote: 'VirMar Marketplace',
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': targetEnvironment,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
    },
  };

  try {
    await axios.post(
      'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
      body,
      config
    );
    console.log('📌 Payment reference ID:', referenceId);
    return { referenceId };
  } catch (error) {
    console.error('🚫 Payment initiation failed:', error.response?.data || error.message);
    throw error;
  }
}

export { checkBalance, initiatePayment };
