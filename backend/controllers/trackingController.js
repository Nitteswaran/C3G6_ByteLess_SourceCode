import Tracking from '../models/Tracking.js'

/**
 * Get all tracking sessions
 */
export const getAllTracking = async (req, res, next) => {
  try {
    const trackingSessions = await Tracking.find().populate('userId')
    res.json({ success: true, data: trackingSessions })
  } catch (error) {
    next(error)
  }
}

/**
 * Get tracking session by ID
 */
export const getTrackingById = async (req, res, next) => {
  try {
    const tracking = await Tracking.findById(req.params.id).populate('userId')
    if (!tracking) {
      return res.status(404).json({ success: false, message: 'Tracking session not found' })
    }
    res.json({ success: true, data: tracking })
  } catch (error) {
    next(error)
  }
}

/**
 * Create new tracking session
 */
export const createTracking = async (req, res, next) => {
  try {
    const tracking = new Tracking(req.body)
    await tracking.save()
    res.status(201).json({ success: true, data: tracking })
  } catch (error) {
    next(error)
  }
}

/**
 * Update tracking session
 */
export const updateTracking = async (req, res, next) => {
  try {
    const tracking = await Tracking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!tracking) {
      return res.status(404).json({ success: false, message: 'Tracking session not found' })
    }
    res.json({ success: true, data: tracking })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete tracking session
 */
export const deleteTracking = async (req, res, next) => {
  try {
    const tracking = await Tracking.findByIdAndDelete(req.params.id)
    if (!tracking) {
      return res.status(404).json({ success: false, message: 'Tracking session not found' })
    }
    res.json({ success: true, message: 'Tracking session deleted' })
  } catch (error) {
    next(error)
  }
}

