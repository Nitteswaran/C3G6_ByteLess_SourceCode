import mongoose from 'mongoose'

const trackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  route: [{
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    speed: Number,
    accuracy: Number,
  }],
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  distance: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

const Tracking = mongoose.model('Tracking', trackingSchema)

export default Tracking

