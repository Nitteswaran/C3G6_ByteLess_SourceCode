import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { User, FREE_AI_LIMIT, PRO_AI_LIMIT } from '../models/User.js';

const router = express.Router();

// @desc    Get current subscription status and usage
// @route   GET /api/subscription/status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check and reset AI usage if needed
    await user.checkAndResetAIUsage();
    
    // Calculate time until reset (in milliseconds)
    const now = new Date();
    const resetTime = new Date(user.aiResetDate);
    resetTime.setDate(resetTime.getDate() + 1); // Next reset is 24h after last reset
    const timeUntilReset = resetTime - now;

    res.json({
      subscriptionStatus: user.subscriptionStatus,
      isPro: user.subscriptionStatus === 'pro',
      aiUsage: user.aiUsage,
      aiLimit: user.aiLimit,
      nextReset: resetTime.toISOString(),
      timeUntilReset,
      freeLimit: FREE_AI_LIMIT,
      proLimit: PRO_AI_LIMIT,
      canUseAI: user.aiUsage < user.aiLimit,
      remainingRequests: Math.max(0, user.aiLimit - user.aiUsage)
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
router.post('/cancel', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.subscriptionStatus !== 'pro' || !user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // Cancel the subscription at the end of the current billing period
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user status to indicate pending cancellation
    user.subscriptionStatus = 'canceled';
    await user.save();

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: subscription.cancel_at
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
