// src/services/userService.js

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  /**
   * Get user profile
   */
  async getProfile(userId, token) {
    try {
      await delay(800);
      
      return {
        success: true,
        data: {
          id: userId,
          name: 'User Name',
          email: 'user@atlas.com',
          phone: '+212 6XX XXX XXX',
          avatar: null,
          bio: 'This is my bio',
          skills: ['JavaScript', 'React Native', 'Node.js'],
          hourlyRate: 250,
          rating: 4.8,
          completedProjects: 42,
          totalEarnings: 125000,
          joinedDate: '2024-01-15',
          verified: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get profile',
      };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData, token) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: {
          ...profileData,
          id: userId,
        },
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }
  },

  /**
   * Upload profile picture
   */
  async uploadAvatar(userId, imageUri, token) {
    try {
      await delay(2000);
      
      return {
        success: true,
        data: {
          avatarUrl: imageUri,
        },
        message: 'Avatar uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to upload avatar',
      };
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId, token) {
    try {
      await delay(800);
      
      return {
        success: true,
        data: {
          totalProjects: 42,
          activeProjects: 3,
          completedProjects: 39,
          totalEarnings: 125000,
          averageRating: 4.8,
          totalReviews: 35,
          responseTime: '2 hours',
          completionRate: 98,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get stats',
      };
    }
  },

  /**
   * Get user projects
   */
  async getUserProjects(userId, status = 'all', token) {
    try {
      await delay(1000);
      
      const allProjects = Array.from({ length: 10 }, (_, i) => ({
        id: `proj-${i + 1}`,
        title: `Projet ${i + 1}`,
        description: `Description du projet ${i + 1}`,
        status: ['En cours', 'Terminé', 'En attente'][i % 3],
        budget: 500 + i * 100,
        deadline: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: Math.floor(Math.random() * 100),
        clientName: `Client ${i + 1}`,
      }));
      
      const filtered = status === 'all' 
        ? allProjects 
        : allProjects.filter(p => p.status === status);
      
      return {
        success: true,
        data: filtered,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get projects',
      };
    }
  },

  /**
   * Get user notifications
   */
  async getNotifications(userId, token) {
    try {
      await delay(600);
      
      return {
        success: true,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: `notif-${i + 1}`,
          type: ['message', 'project', 'payment', 'review'][i % 4],
          title: `Notification ${i + 1}`,
          message: `Message de notification ${i + 1}`,
          read: i % 2 === 0,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get notifications',
      };
    }
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId, token) {
    try {
      await delay(300);
      
      return {
        success: true,
        message: 'Notification marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to mark notification',
      };
    }
  },
};

export default userService;
