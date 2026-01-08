// src/services/applicationService.js

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const applicationService = {
  /**
   * Get all applications for a project
   */
  async getProjectApplications(projectId) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: [
          {
            id: 'app-1',
            projectId,
            freelancerId: 'freelancer-1',
            freelancerName: 'Ahmed Saidi',
            freelancerAvatar: '👨‍💻',
            freelancerRating: 4.8,
            freelancerReviews: 24,
            proposedBudget: 7500,
            proposedDuration: '3 semaines',
            coverLetter: 'Je suis très intéressé par ce projet. Avec 5 ans d\'expérience en React Native...',
            submittedDate: '2025-01-08T10:30:00',
            status: 'pending',
            portfolio: ['App1', 'App2', 'App3'],
          },
          {
            id: 'app-2',
            projectId,
            freelancerId: 'freelancer-2',
            freelancerName: 'Sarah Bennani',
            freelancerAvatar: '👩‍💻',
            freelancerRating: 4.9,
            freelancerReviews: 31,
            proposedBudget: 8000,
            proposedDuration: '2.5 semaines',
            coverLetter: 'Développeuse React Native passionnée avec expérience en e-commerce...',
            submittedDate: '2025-01-07T15:45:00',
            status: 'pending',
            portfolio: ['App1', 'App2'],
          },
          {
            id: 'app-3',
            projectId,
            freelancerId: 'freelancer-3',
            freelancerName: 'Karim Alaoui',
            freelancerAvatar: '👨‍💼',
            freelancerRating: 4.5,
            freelancerReviews: 18,
            proposedBudget: 6500,
            proposedDuration: '4 semaines',
            coverLetter: 'Spécialiste en applications mobiles de haute qualité...',
            submittedDate: '2025-01-06T09:20:00',
            status: 'pending',
            portfolio: ['App1', 'App2', 'App3', 'App4'],
          },
        ],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get applications',
      };
    }
  },

  /**
   * Get all applications for a client's projects
   */
  async getClientApplications(clientId) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: [
          {
            id: 'app-1',
            projectId: 'proj-1',
            projectTitle: 'Développement application mobile',
            freelancerId: 'freelancer-1',
            freelancerName: 'Ahmed Saidi',
            freelancerRating: 4.8,
            proposedBudget: 7500,
            submittedDate: '2025-01-08T10:30:00',
            status: 'pending',
          },
          {
            id: 'app-2',
            projectId: 'proj-1',
            projectTitle: 'Développement application mobile',
            freelancerId: 'freelancer-2',
            freelancerName: 'Sarah Bennani',
            freelancerRating: 4.9,
            proposedBudget: 8000,
            submittedDate: '2025-01-07T15:45:00',
            status: 'pending',
          },
          {
            id: 'app-3',
            projectId: 'proj-2',
            projectTitle: 'Design de logo et identité visuelle',
            freelancerId: 'freelancer-4',
            freelancerName: 'Leila Mansouri',
            freelancerRating: 4.7,
            proposedBudget: 2500,
            submittedDate: '2025-01-06T14:00:00',
            status: 'accepted',
          },
        ],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get applications',
      };
    }
  },

  /**
   * Accept an application
   */
  async acceptApplication(applicationId, freelancerId) {
    try {
      await delay(1000);
      
      return {
        success: true,
        message: 'Candidature acceptée avec succès',
        data: {
          applicationId,
          status: 'accepted',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to accept application',
      };
    }
  },

  /**
   * Reject an application
   */
  async rejectApplication(applicationId) {
    try {
      await delay(800);
      
      return {
        success: true,
        message: 'Candidature refusée',
        data: {
          applicationId,
          status: 'rejected',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to reject application',
      };
    }
  },

  /**
   * Award project to freelancer
   */
  async awardProject(projectId, freelancerId, contractTerms) {
    try {
      await delay(1200);
      
      return {
        success: true,
        message: 'Projet attribué avec succès',
        data: {
          projectId,
          freelancerId,
          status: 'in_progress',
          contractId: 'contract-' + Date.now(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to award project',
      };
    }
  },

  /**
   * Shortlist an application
   */
  async shortlistApplication(applicationId) {
    try {
      await delay(600);
      
      return {
        success: true,
        message: 'Candidat ajouté à la shortlist',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to shortlist application',
      };
    }
  },

  /**
   * Get freelancer details
   */
  async getFreelancerProfile(freelancerId) {
    try {
      await delay(800);
      
      return {
        success: true,
        data: {
          id: freelancerId,
          name: 'Ahmed Saidi',
          rating: 4.8,
          reviews: 24,
          avatar: '👨‍💻',
          hourlyRate: 500,
          location: 'Casablanca, Maroc',
          languages: ['Français', 'Anglais', 'Arabe'],
          bio: 'Développeur React Native passionné avec 5 ans d\'expérience...',
          skills: ['React Native', 'JavaScript', 'Firebase', 'API REST'],
          portfolio: [
            { id: '1', title: 'App1', url: 'https://...' },
            { id: '2', title: 'App2', url: 'https://...' },
          ],
          completedProjects: 32,
          onTimeDelivery: '98%',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get freelancer profile',
      };
    }
  },
};

export default applicationService;
