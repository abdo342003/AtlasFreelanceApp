// src/services/paymentService.js

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const paymentService = {
  /**
   * Get budget summary for a project
   */
  async getProjectBudgetSummary(projectId) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: {
          projectId,
          totalBudget: 10000,
          allocated: 7500,
          spent: 5000,
          remaining: 2500,
          escrow: 7500,
          released: 0,
          pending: 2500,
          currencyCode: 'MAD',
          currency: 'MAD',
          milestones: [
            {
              id: 'ms-1',
              title: 'Design & Planning',
              budget: 3000,
              spent: 3000,
              status: 'completed',
              dueDate: '2025-01-15',
            },
            {
              id: 'ms-2',
              title: 'Development Phase 1',
              budget: 4000,
              spent: 2000,
              status: 'in_progress',
              dueDate: '2025-02-15',
            },
            {
              id: 'ms-3',
              title: 'Testing & Deployment',
              budget: 3000,
              spent: 0,
              status: 'pending',
              dueDate: '2025-03-15',
            },
          ],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get budget summary',
      };
    }
  },

  /**
   * Get payment history for client
   */
  async getPaymentHistory(clientId, limit = 20) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: [
          {
            id: 'pay-1',
            projectId: 'proj-1',
            projectTitle: 'App Mobile',
            freelancerId: 'free-1',
            freelancerName: 'Ahmed Saidi',
            amount: 3000,
            status: 'released',
            date: '2025-01-10',
            type: 'milestone_completion',
            description: 'Paiement du design',
          },
          {
            id: 'pay-2',
            projectId: 'proj-1',
            projectTitle: 'App Mobile',
            freelancerId: 'free-1',
            freelancerName: 'Ahmed Saidi',
            amount: 2000,
            status: 'pending_approval',
            date: '2025-01-15',
            type: 'partial_delivery',
            description: 'Première phase du développement',
          },
          {
            id: 'pay-3',
            projectId: 'proj-2',
            projectTitle: 'Logo Design',
            freelancerId: 'free-2',
            freelancerName: 'Leila Mansouri',
            amount: 2500,
            status: 'pending_release',
            date: '2025-01-20',
            type: 'full_project',
            description: 'Livraison complète',
          },
        ],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
      };
    }
  },

  /**
   * Release payment to freelancer
   */
  async releasePayment(paymentId) {
    try {
      await delay(1200);
      
      return {
        success: true,
        message: 'Paiement libéré avec succès',
        data: {
          paymentId,
          status: 'released',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to release payment',
      };
    }
  },

  /**
   * Get overall client budget summary
   */
  async getClientBudgetSummary(clientId) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: {
          clientId,
          totalSpent: 5000,
          totalBudgeted: 15000,
          activeProjects: 2,
          completedProjects: 3,
          averageProjectBudget: 5000,
          monthlySpending: [
            { month: 'Nov', amount: 1500 },
            { month: 'Dec', amount: 2000 },
            { month: 'Jan', amount: 1500 },
          ],
          topFreelancers: [
            { id: '1', name: 'Ahmed Saidi', totalPaid: 5000 },
            { id: '2', name: 'Leila Mansouri', totalPaid: 2500 },
          ],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get budget summary',
      };
    }
  },

  /**
   * Create a payment request
   */
  async createPaymentRequest(projectId, freelancerId, amount, description) {
    try {
      await delay(800);
      
      return {
        success: true,
        message: 'Demande de paiement créée',
        data: {
          id: 'pay-' + Date.now(),
          status: 'pending_approval',
          amount,
          date: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create payment request',
      };
    }
  },

  /**
   * Dispute a payment
   */
  async disputePayment(paymentId, reason) {
    try {
      await delay(1000);
      
      return {
        success: true,
        message: 'Litige signalé, notre équipe intervient',
        data: {
          paymentId,
          status: 'disputed',
          disputeId: 'dispute-' + Date.now(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to dispute payment',
      };
    }
  },
};

export default paymentService;
