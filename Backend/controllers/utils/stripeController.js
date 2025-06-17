import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Delete a connected Stripe account
export const deleteConnectedAccount = async (req, res) => {
  const { accountId } = req.params;
  
  if (!accountId) {
    return res.status(400).json({ message: 'Account ID is required' });
  }

  try {
    const deletedAccount = await stripe.accounts.del(accountId);
    
    res.status(200).json({
      success: true,
      message: `Connected account deleted successfully`,
      data: { id: deletedAccount.id }
    });
  } catch (error) {
    console.error(`Failed to delete connected account: ${error.message}`);
    res.status(400).json({
      success: false,
      message: `Failed to delete connected account: ${error.message}`
    });
  }
}; 