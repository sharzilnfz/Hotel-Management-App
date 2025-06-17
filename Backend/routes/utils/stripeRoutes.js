import express from 'express';
import { deleteConnectedAccount } from '../controllers/stripeController.js';

const router = express.Router();

// Route to delete a connected Stripe account
router.delete('/connected-account/:accountId', deleteConnectedAccount);

export default router; 