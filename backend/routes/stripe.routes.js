import express from 'express';
import { User } from '../models/User.js';
import { stripe, getStripePriceId, getWebhookSecret } from '../config/stripe.js';
import { SUBSCRIPTION_STATUS } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create Stripe Checkout Session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Create a Stripe customer if not exists
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString(),
        },
      });
      
      // Save Stripe customer ID to user
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        {
          price: getStripePriceId(),
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// @desc    Create Stripe Customer Portal Session
// @route   POST /api/stripe/create-portal-session
// @access  Private
router.post('/create-portal-session', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// @desc    Webhook handler for Stripe events
// @route   POST /api/stripe/webhook
// @note    This is a raw body parser for Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      getWebhookSecret()
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Webhook Handlers
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  await User.findByIdAndUpdate(userId, {
    subscriptionStatus: SUBSCRIPTION_STATUS.PRO,
    stripeSubscriptionId: subscription.id,
    aiLimit: 200, // PRO_AI_LIMIT
  });
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) return;

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await user.upgradeToPro({
      customerId: subscription.customer,
      subscriptionId: subscription.id
    });
  } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    // Handle payment failures or past due status
    await user.downgradeToFree();
  }
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (user) {
    await user.downgradeToFree();
  }
}

async function handlePaymentSucceeded(invoice) {
  // Handle successful payment (e.g., extend subscription)
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  if (subscription) {
    await handleSubscriptionUpdated(subscription);
  }
}

async function handlePaymentFailed(invoice) {
  // Handle payment failure (e.g., send email notification)
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (user) {
    // You might want to send an email to the user here
    console.log(`Payment failed for user ${user.email}`);
  }
}

export default router;
