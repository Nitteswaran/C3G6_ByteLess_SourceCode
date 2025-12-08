import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest API version
  typescript: false,
});

export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY;
};

export const getStripePriceId = () => {
  if (!process.env.STRIPE_PRICE_ID) {
    throw new Error('STRIPE_PRICE_ID is not set in environment variables');
  }
  return process.env.STRIPE_PRICE_ID;
};

export const getWebhookSecret = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
  }
  return process.env.STRIPE_WEBHOOK_SECRET;
};
