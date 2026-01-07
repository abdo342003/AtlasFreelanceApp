// src/services/loggingService.js

/**
 * Simple logging service for development and debugging
 */
export const loggingService = {
  /**
   * Log info messages
   */
  info(message, data = {}) {
    if (__DEV__) {
      console.log(`[INFO] ${message}`, data);
    }
  },

  /**
   * Log warning messages
   */
  warn(message, data = {}) {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * Log error messages
   */
  error(message, data = {}) {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, data);
    }
  },

  /**
   * Log debug messages
   */
  debug(message, data = {}) {
    if (__DEV__) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
};

export default loggingService;
