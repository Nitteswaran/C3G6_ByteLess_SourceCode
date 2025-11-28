import mongoose from 'mongoose'

const emergencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  type: {
    type: String,
    enum: ['medical', 'safety', 'other'],
    default: 'other',
  },
  message: String,
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active',
  },
  respondedBy: String,
  responseTime: Date,
}, {
  timestamps: true,
})

const Emergency = mongoose.model('Emergency', emergencySchema)

export default Emergency

