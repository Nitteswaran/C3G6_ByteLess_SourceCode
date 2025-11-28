/**
 * Calculate Safety Score Utility
 * 
 * Calculates a safety score (0-3) based on multiple factors:
 * - crowdDensity: 0-100 (higher is better)
 * - lighting: 0-100 (higher is better)
 * - incidents: 0-10 (lower is better)
 * - weatherRisk: 0-100 (lower is better)
 * 
 * @param {Object} params - Safety parameters
 * @param {number} params.crowdDensity - Crowd density (0-100)
 * @param {number} params.lighting - Lighting quality (0-100)
 * @param {number} params.incidents - Number of incidents (0-10)
 * @param {number} params.weatherRisk - Weather risk level (0-100)
 * @returns {number} Safety score from 0-3 (0=Very Unsafe, 1=Unsafe, 2=Safe, 3=Very Safe)
 */

export const calculateSafetyScore = ({ crowdDensity, lighting, incidents, weatherRisk }) => {
  // Normalize inputs to ensure they're within expected ranges
  const normalizedCrowdDensity = Math.max(0, Math.min(100, crowdDensity || 0))
  const normalizedLighting = Math.max(0, Math.min(100, lighting || 0))
  const normalizedIncidents = Math.max(0, Math.min(10, incidents || 10))
  const normalizedWeatherRisk = Math.max(0, Math.min(100, weatherRisk || 100))

  // Calculate individual factor scores (0-1 scale)
  // Higher crowd density = safer (more people around)
  const crowdScore = normalizedCrowdDensity / 100

  // Higher lighting = safer
  const lightingScore = normalizedLighting / 100

  // Lower incidents = safer (inverse relationship)
  const incidentsScore = 1 - (normalizedIncidents / 10)

  // Lower weather risk = safer (inverse relationship)
  const weatherScore = 1 - (normalizedWeatherRisk / 100)

  // Weighted average of all factors
  // You can adjust these weights based on importance
  const weights = {
    crowd: 0.25,      // 25% weight
    lighting: 0.30,   // 30% weight (most important)
    incidents: 0.30,  // 30% weight (most important)
    weather: 0.15,    // 15% weight
  }

  const weightedScore =
    crowdScore * weights.crowd +
    lightingScore * weights.lighting +
    incidentsScore * weights.incidents +
    weatherScore * weights.weather

  // Convert to 0-3 scale
  // 0.0 - 0.25 = 0 (Very Unsafe - Red)
  // 0.25 - 0.50 = 1 (Unsafe - Orange)
  // 0.50 - 0.75 = 2 (Safe - Yellow)
  // 0.75 - 1.0 = 3 (Very Safe - Green)
  
  if (weightedScore < 0.25) return 0
  if (weightedScore < 0.50) return 1
  if (weightedScore < 0.75) return 2
  return 3
}

/**
 * Get color for safety score
 * @param {number} score - Safety score (0-3)
 * @returns {string} Color hex code
 */
export const getSafetyColor = (score) => {
  const colors = {
    0: '#ef4444', // Red - Very Unsafe
    1: '#f97316', // Orange - Unsafe
    2: '#eab308', // Yellow - Safe
    3: '#22c55e', // Green - Very Safe
  }
  return colors[score] || colors[0]
}

/**
 * Get safety label for score
 * @param {number} score - Safety score (0-3)
 * @returns {string} Safety label
 */
export const getSafetyLabel = (score) => {
  const labels = {
    0: 'Very Unsafe',
    1: 'Unsafe',
    2: 'Safe',
    3: 'Very Safe',
  }
  return labels[score] || labels[0]
}

export default {
  calculateSafetyScore,
  getSafetyColor,
  getSafetyLabel,
}

