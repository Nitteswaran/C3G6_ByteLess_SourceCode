import mongoose from 'mongoose'

const guardianSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Accept both String and ObjectId
    required: true,
    default: 'default-user-id',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: undefined,
    validate: {
      validator: function(v) {
        // Phone is optional, but if provided, should be valid format
        if (!v) return true // Allow undefined or empty
        // Very flexible phone validation - just check for minimum digits
        const digitsOnly = v.replace(/[^\d+]/g, '').replace(/\+/g, '')
        return digitsOnly.length >= 7 && digitsOnly.length <= 15
      },
      message: 'Phone number must have 7-15 digits',
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Email is optional, but if provided, should be valid format
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      },
      message: 'Invalid email format',
    },
  },
  relationship: {
    type: String,
    enum: ['family', 'friend', 'colleague', 'other'],
    default: 'other',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastNotified: Date,
}, {
  timestamps: true,
})

// Ensure at least phone or email is provided
guardianSchema.pre('validate', function(next) {
  if (!this.phone && !this.email) {
    this.invalidate('contact', 'Either phone or email must be provided')
  }
  next()
})

// Index for faster queries
guardianSchema.index({ userId: 1, isActive: 1 })

const Guardian = mongoose.model('Guardian', guardianSchema)

export default Guardian

