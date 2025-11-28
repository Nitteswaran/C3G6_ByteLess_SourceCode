import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  }],
}, {
  timestamps: true,
})

const User = mongoose.model('User', userSchema)

export default User

