import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const SUBSCRIPTION_STATUS = {
  FREE: 'free',
  PRO: 'pro',
  CANCELED: 'canceled'
}

const FREE_AI_LIMIT = 10
const PRO_AI_LIMIT = 200

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't include password in queries by default
  },
  phone: String,
  location: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  emergencyContacts: [{
    name: String,
    phone: String,
    email: String,
    relationship: String,
  }],
  // Points and gamification
  points: {
    type: Number,
    default: 0,
  },
  achievements: [{
    achievementId: String,
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Journal statistics
  journalEntriesCount: {
    type: Number,
    default: 0,
  },
  incidentsReportedCount: {
    type: Number,
    default: 0,
  },
  lastJournalEntryAt: Date,
  lastIncidentReportedAt: Date,
  // Spam prevention
  lastActions: [{
    action: String, // 'journal' or 'incident'
    timestamp: Date,
  }],
  // Subscription and AI Usage
  subscriptionStatus: {
    type: String,
    enum: Object.values(SUBSCRIPTION_STATUS),
    default: SUBSCRIPTION_STATUS.FREE,
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  aiUsage: {
    type: Number,
    default: 0,
  },
  aiLimit: {
    type: Number,
    default: FREE_AI_LIMIT,
  },
  aiResetDate: {
    type: Date,
    default: () => new Date(),
  },
  // Track subscription period
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
}, {
  timestamps: true,
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Index for leaderboard queries
userSchema.index({ points: -1 });

// Method to check and reset AI usage if needed
userSchema.methods.checkAndResetAIUsage = async function() {
  const now = new Date();
  const lastReset = new Date(this.aiResetDate);
  
  // Check if we need to reset (24 hours passed since last reset)
  const hoursDiff = (now - lastReset) / (1000 * 60 * 60);
  
  if (hoursDiff >= 24) {
    this.aiUsage = 0;
    this.aiResetDate = now;
    await this.save();
  }
  
  return this;
};

// Method to check if user can make AI request
userSchema.methods.canMakeAIRequest = function() {
  return this.aiUsage < this.aiLimit;
};

// Method to increment AI usage
userSchema.methods.incrementAIUsage = async function() {
  await this.checkAndResetAIUsage();
  
  if (this.aiUsage < this.aiLimit) {
    this.aiUsage += 1;
    await this.save();
    return true;
  }
  
  return false;
};

// Method to upgrade to pro
userSchema.methods.upgradeToPro = async function(subscriptionData) {
  this.subscriptionStatus = SUBSCRIPTION_STATUS.PRO;
  this.aiLimit = PRO_AI_LIMIT;
  this.stripeCustomerId = subscriptionData.customerId;
  this.stripeSubscriptionId = subscriptionData.subscriptionId;
  this.subscriptionStartDate = new Date();
  this.subscriptionEndDate = new Date();
  this.subscriptionEndDate.setMonth(this.subscriptionEndDate.getMonth() + 1); // 1 month from now
  
  await this.save();
};

// Method to downgrade to free
userSchema.methods.downgradeToFree = async function() {
  this.subscriptionStatus = SUBSCRIPTION_STATUS.FREE;
  this.aiLimit = FREE_AI_LIMIT;
  this.aiUsage = 0; // Reset usage on downgrade
  this.subscriptionEndDate = new Date();
  
  await this.save();
};

const User = mongoose.model('User', userSchema);

export { User, SUBSCRIPTION_STATUS, FREE_AI_LIMIT, PRO_AI_LIMIT };

