import express from 'express';
import {
  confirmPayment,
  createPaymentIntent,
  deleteConnectedAccount,
  getPaymentHistory,
  getPublishableKey,
  testStripeConnection,
} from '../../controllers/utils/stripeController.js';

const router = express.Router();

// Test route
router.get('/test', testStripeConnection);

// Payment processing routes
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-payment', confirmPayment);
router.get('/payment-history', getPaymentHistory);
router.get('/publishable-key', getPublishableKey);

// Connected accounts
router.delete('/connected-account/:accountId', deleteConnectedAccount);

export default router;
