// src/services/authGuard.js

/**
 * Auth guard utilities for route protection
 */
export const authGuard = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated(user) {
    return user && user.token;
  },

  /**
   * Check if user has admin role
   */
  isAdmin(user) {
    return user && user.role === 'admin';
  },

  /**
   * Check if user has specific role
   */
  hasRole(user, role) {
    return user && user.role === role;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user, roles = []) {
    return user && roles.includes(user.role);
  },
};

export default authGuard;
