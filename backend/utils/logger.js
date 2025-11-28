/**
 * Simple logger utility
 * Can be extended with winston or other logging libraries
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

const logLevels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
}

/**
 * Format log message with timestamp
 */
const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString()
  const levelColor = 
    level === logLevels.ERROR ? colors.red :
    level === logLevels.WARN ? colors.yellow :
    level === logLevels.DEBUG ? colors.cyan :
    colors.green

  return `${colors.bright}${levelColor}[${level}]${colors.reset} ${timestamp} - ${message}`
}

export const logger = {
  info: (message) => {
    console.log(formatMessage(logLevels.INFO, message))
  },
  
  warn: (message) => {
    console.warn(formatMessage(logLevels.WARN, message))
  },
  
  error: (message) => {
    console.error(formatMessage(logLevels.ERROR, message))
  },
  
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatMessage(logLevels.DEBUG, message))
    }
  },
}

export default logger

