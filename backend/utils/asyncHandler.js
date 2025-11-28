/**
 * Async handler utility
 * Wraps async route handlers to catch errors automatically
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 * 
 * @example
 * router.get('/route', asyncHandler(async (req, res) => {
 *   const data = await someAsyncOperation()
 *   res.json({ success: true, data })
 * }))
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler

