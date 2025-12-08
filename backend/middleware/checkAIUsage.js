import { User } from '../models/User.js';
import { FREE_AI_LIMIT, PRO_AI_LIMIT } from '../models/User.js';

export const checkAIUsage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check and reset AI usage if needed
    await user.checkAndResetAIUsage();

    // Check if user can make AI request
    if (!user.canMakeAIRequest()) {
      return res.status(429).json({
        error: 'Daily AI limit reached',
        currentUsage: user.aiUsage,
        limit: user.aiLimit,
        resetTime: user.aiResetDate,
        isPro: user.subscriptionStatus === 'pro',
        upgradeRequired: user.aiUsage >= FREE_AI_LIMIT
      });
    }

    // Attach user to request for later use
    req.userData = user;
    next();
  } catch (error) {
    console.error('Error in checkAIUsage middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is pro, continue
    if (user.subscriptionStatus === 'pro') {
      return next();
    }

    // If user is not pro but has free requests left, continue
    if (user.aiUsage < FREE_AI_LIMIT) {
      return next();
    }

    // User needs to upgrade
    return res.status(402).json({
      error: 'Subscription required',
      message: 'Upgrade to Pro to continue using AI features',
      currentUsage: user.aiUsage,
      freeLimit: FREE_AI_LIMIT,
      proLimit: PRO_AI_LIMIT,
      upgradeRequired: true
    });
  } catch (error) {
    console.error('Error in checkSubscription middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
