// src/services/authService.js
const API_BASE_URL = 'http://localhost:3000/api/auth';

// Mock delay for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  /**
   * Login with email and password
   */
  async login(email, password) {
    try {
      // Simulate API call
      await delay(1000);
      
      // Mock authentication logic
      if (email.includes('admin')) {
        return {
          success: true,
          data: {
            id: 'admin-1',
            email,
            name: 'Admin User',
            role: 'admin',
            token: 'admin-token-' + Date.now(),
          },
        };
      } else {
        return {
          success: true,
          data: {
            id: 'user-' + Date.now(),
            email,
            name: email.split('@')[0],
            role: 'user',
            token: 'user-token-' + Date.now(),
          },
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  /**
   * Register new user
   */
  async signup(userData) {
    try {
      await delay(1500);
      
      const { email, password, role, ...otherData } = userData;
      
      return {
        success: true,
        data: {
          id: 'user-' + Date.now(),
          email,
          role: role || 'user',
          ...otherData,
          token: 'token-' + Date.now(),
          emailVerified: false,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Signup failed',
      };
    }
  },

  /**
   * Send password reset email
   */
  async forgotPassword(email) {
    try {
      await delay(1000);
      
      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to send reset email',
      };
    }
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token) {
    try {
      await delay(1000);
      
      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Email verification failed',
      };
    }
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email) {
    try {
      await delay(1000);
      
      return {
        success: true,
        message: 'Verification email sent',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to resend email',
      };
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      await delay(1000);
      
      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  },

  /**
   * Validate auth token
   */
  async validateToken(token) {
    try {
      await delay(500);
      
      // In a real app, this would validate with the backend
      if (token && token.startsWith('admin-token')) {
        return {
          success: true,
          data: {
            id: 'admin-1',
            email: 'admin@atlas.com',
            name: 'Admin User',
            role: 'admin',
            token,
          },
        };
      } else if (token) {
        return {
          success: true,
          data: {
            id: 'user-1',
            email: 'user@atlas.com',
            name: 'Regular User',
            role: 'user',
            token,
          },
        };
      }
      
      return {
        success: false,
        error: 'Invalid token',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Token validation failed',
      };
    }
  },

  /**
   * Logout (clear server session if needed)
   */
  async logout(token) {
    try {
      await delay(500);
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Logout failed',
      };
    }
  },
};

export default authService;
