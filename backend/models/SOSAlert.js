import mongoose from 'mongoose'

const sosAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  currentLocation: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  guardiansNotified: [
    {
      guardianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guardian',
      },
      name: String,
      phone: String,
      email: String,
      notificationMethod: {
        type: String,
        enum: ['sms', 'email', 'both'],
      },
      notificationStatus: {
        type: String,
        enum: ['sent', 'failed', 'pending'],
        default: 'sent',
      },
      notifiedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active',
  },
  resolvedAt: Date,
}, {
  timestamps: true,
})

// Index for faster queries
sosAlertSchema.index({ userId: 1, timestamp: -1 })
sosAlertSchema.index({ status: 1, timestamp: -1 })

const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema)

export default SOSAlert

