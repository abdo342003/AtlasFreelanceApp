// src/services/adminApi.js
import { loggingService } from './loggingService';

const API_BASE_URL = 'http://localhost:3000/api/admin';

// Mock data for development
const MOCK_DATA = {
  users: Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Freelancer' : 'Client',
    status: i % 5 === 0 ? 'Bloqué' : i % 4 === 0 ? 'Nouveau' : 'Actif',
    city: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger'][i % 5],
    phone: `+212 6${String(i).padStart(8, '0')}`,
    joinedDate: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    totalProjects: Math.floor(Math.random() * 20),
    rating: (3 + Math.random() * 2).toFixed(1),
    verified: i % 3 !== 0,
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  })),
  
  projects: Array.from({ length: 30 }, (_, i) => ({
    id: `proj-${i + 1}`,
    title: `Projet ${i + 1}`,
    description: `Description du projet ${i + 1}`,
    status: ['En cours', 'Terminé', 'Annulé', 'En attente'][i % 4],
    budget: `${(500 + i * 100)} MAD`,
    clientId: `user-${(i % 20) + 1}`,
    freelancerId: `user-${(i % 30) + 1}`,
    clientName: `Client ${(i % 20) + 1}`,
    freelancerName: `Freelancer ${(i % 30) + 1}`,
    createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    deadline: new Date(2025, (i + 3) % 12, (i % 28) + 1).toISOString(),
    category: ['Développement', 'Design', 'Marketing', 'Rédaction'][i % 4],
    progress: Math.floor(Math.random() * 100),
  })),
  
  disputes: Array.from({ length: 15 }, (_, i) => ({
    id: `dispute-${i + 1}`,
    projectId: `proj-${(i % 30) + 1}`,
    projectTitle: `Projet ${(i % 30) + 1}`,
    reportedBy: `user-${(i % 50) + 1}`,
    reportedByName: `User ${(i % 50) + 1}`,
    against: `user-${((i + 10) % 50) + 1}`,
    againstName: `User ${((i + 10) % 50) + 1}`,
    reason: ['Non-paiement', 'Travail non livré', 'Mauvaise qualité', 'Communication'][i % 4],
    status: ['Ouvert', 'En cours', 'Résolu', 'Fermé'][i % 4],
    priority: ['Haute', 'Moyenne', 'Basse'][i % 3],
    description: `Détails du litige ${i + 1}...`,
    createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
    messages: [],
  })),
};

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    loggingService.error('Admin API Error', { endpoint, error: error.message });
    
    // Return mock data in development
    return handleMockResponse(endpoint, options);
  }
}

// Mock response handler
function handleMockResponse(endpoint, options) {
  console.log('Using mock data for:', endpoint);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: getMockData(endpoint, options) });
    }, 500);
  });
}

function getMockData(endpoint, options) {
  if (endpoint.includes('/users')) return MOCK_DATA.users;
  if (endpoint.includes('/projects')) return MOCK_DATA.projects;
  if (endpoint.includes('/disputes')) return MOCK_DATA.disputes;
  if (endpoint.includes('/analytics')) return getAnalyticsMock();
  return {};
}

function getAnalyticsMock() {
  return {
    kpis: {
      totalUsers: 1234,
      activeProjects: 127,
      openDisputes: 3,
      monthlyRevenue: 45200,
      newUsers: 23,
      completedProjects: 89,
    },
    charts: {
      userGrowth: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][i],
        value: Math.floor(80 + Math.random() * 50),
      })),
      projectsByCategory: [
        { category: 'Développement', count: 45 },
        { category: 'Design', count: 32 },
        { category: 'Marketing', count: 28 },
        { category: 'Rédaction', count: 22 },
      ],
    },
    recentActivity: Array.from({ length: 10 }, (_, i) => ({
      id: `activity-${i}`,
      type: ['user_joined', 'project_created', 'dispute_opened', 'payment_made'][i % 4],
      description: `Activité ${i + 1}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      user: `User ${i + 1}`,
    })),
  };
}

// ============== USER MANAGEMENT ==============

export const adminUserService = {
  // Get all users with pagination and filters
  async getUsers(params = {}) {
    const { page = 1, limit = 20, search = '', role = '', status = '', sortBy = 'joinedDate', sortOrder = 'desc' } = params;
    
    let result = await apiCall('/users', {
      method: 'GET',
      headers: {
        'Authorization': params.token ? `Bearer ${params.token}` : '',
      },
    });

    if (result.success) {
      let users = result.data;
      
      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter(u => 
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.city.toLowerCase().includes(searchLower)
        );
      }
      
      if (role) {
        users = users.filter(u => u.role === role);
      }
      
      if (status) {
        users = users.filter(u => u.status === status);
      }
      
      // Sort
      users.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const order = sortOrder === 'asc' ? 1 : -1;
        return aVal > bVal ? order : -order;
      });
      
      // Paginate
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = users.slice(start, end);
      
      return {
        success: true,
        data: {
          users: paginatedUsers,
          total: users.length,
          page,
          totalPages: Math.ceil(users.length / limit),
        },
      };
    }
    
    return result;
  },

  // Get single user details
  async getUserDetails(userId, token) {
    return await apiCall(`/users/${userId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Update user
  async updateUser(userId, updates, token) {
    loggingService.info('Updating user', { userId, updates });
    
    return await apiCall(`/users/${userId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  },

  // Block/Unblock user
  async toggleUserBlock(userId, token) {
    loggingService.warn('Toggling user block', { userId });
    
    return await apiCall(`/users/${userId}/toggle-block`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Delete user
  async deleteUser(userId, token) {
    loggingService.error('Deleting user', { userId });
    
    return await apiCall(`/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Verify user
  async verifyUser(userId, token) {
    return await apiCall(`/users/${userId}/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Bulk actions
  async bulkAction(userIds, action, token) {
    loggingService.info('Bulk user action', { count: userIds.length, action });
    
    return await apiCall('/users/bulk', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userIds, action }),
    });
  },

  // Export users
  async exportUsers(format = 'csv', filters = {}, token) {
    return await apiCall(`/users/export?format=${format}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(filters),
    });
  },
};

// ============== PROJECT MANAGEMENT ==============

export const adminProjectService = {
  // Get all projects
  async getProjects(params = {}) {
    const { page = 1, limit = 20, search = '', status = '', category = '' } = params;
    
    let result = await apiCall('/projects', {
      method: 'GET',
      headers: {
        'Authorization': params.token ? `Bearer ${params.token}` : '',
      },
    });

    if (result.success) {
      let projects = result.data;
      
      // Apply filters
      if (search) {
        const searchLower = search.toLowerCase();
        projects = projects.filter(p => 
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.clientName.toLowerCase().includes(searchLower) ||
          p.freelancerName.toLowerCase().includes(searchLower)
        );
      }
      
      if (status) {
        projects = projects.filter(p => p.status === status);
      }
      
      if (category) {
        projects = projects.filter(p => p.category === category);
      }
      
      // Paginate
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProjects = projects.slice(start, end);
      
      return {
        success: true,
        data: {
          projects: paginatedProjects,
          total: projects.length,
          page,
          totalPages: Math.ceil(projects.length / limit),
        },
      };
    }
    
    return result;
  },

  // Get project details
  async getProjectDetails(projectId, token) {
    return await apiCall(`/projects/${projectId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Update project status
  async updateProjectStatus(projectId, status, token) {
    loggingService.info('Updating project status', { projectId, status });
    
    return await apiCall(`/projects/${projectId}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  // Cancel project
  async cancelProject(projectId, reason, token) {
    loggingService.warn('Cancelling project', { projectId, reason });
    
    return await apiCall(`/projects/${projectId}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    });
  },
};

// ============== DISPUTE MANAGEMENT ==============

export const adminDisputeService = {
  // Get all disputes
  async getDisputes(params = {}) {
    const { page = 1, limit = 20, status = '', priority = '' } = params;
    
    let result = await apiCall('/disputes', {
      method: 'GET',
      headers: {
        'Authorization': params.token ? `Bearer ${params.token}` : '',
      },
    });

    if (result.success) {
      let disputes = result.data;
      
      // Apply filters
      if (status) {
        disputes = disputes.filter(d => d.status === status);
      }
      
      if (priority) {
        disputes = disputes.filter(d => d.priority === priority);
      }
      
      // Paginate
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedDisputes = disputes.slice(start, end);
      
      return {
        success: true,
        data: {
          disputes: paginatedDisputes,
          total: disputes.length,
          page,
          totalPages: Math.ceil(disputes.length / limit),
        },
      };
    }
    
    return result;
  },

  // Get dispute details
  async getDisputeDetails(disputeId, token) {
    return await apiCall(`/disputes/${disputeId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Update dispute status
  async updateDisputeStatus(disputeId, status, token) {
    loggingService.info('Updating dispute status', { disputeId, status });
    
    return await apiCall(`/disputes/${disputeId}/status`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  // Resolve dispute
  async resolveDispute(disputeId, resolution, token) {
    loggingService.info('Resolving dispute', { disputeId });
    
    return await apiCall(`/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(resolution),
    });
  },

  // Add message to dispute
  async addDisputeMessage(disputeId, message, token) {
    return await apiCall(`/disputes/${disputeId}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ message }),
    });
  },
};

// ============== ANALYTICS ==============

export const adminAnalyticsService = {
  // Get dashboard analytics
  async getDashboardAnalytics(token) {
    try {
      const result = await apiCall('/analytics/dashboard', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      // Ensure the result has proper structure
      if (result && result.success && result.data) {
        return {
          success: true,
          data: {
            kpis: result.data.kpis || {},
            charts: result.data.charts || {},
            recentActivity: result.data.recentActivity || [],
          },
        };
      }
      
      // If no valid data, return mock data
      return {
        success: true,
        data: getAnalyticsMock(),
      };
    } catch (error) {
      console.error('Analytics error:', error);
      // Return mock data on error
      return {
        success: true,
        data: getAnalyticsMock(),
      };
    }
  },

  // Get user statistics
  async getUserStats(period = '30d', token) {
    return await apiCall(`/analytics/users?period=${period}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Get revenue statistics
  async getRevenueStats(period = '30d', token) {
    return await apiCall(`/analytics/revenue?period=${period}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Get recent activity
  async getRecentActivity(limit = 10, token) {
    return await apiCall(`/analytics/activity?limit=${limit}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
};

// ============== SETTINGS ==============

export const adminSettingsService = {
  // Get platform settings
  async getSettings(token) {
    return await apiCall('/settings', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Update settings
  async updateSettings(settings, token) {
    loggingService.info('Updating platform settings');
    
    return await apiCall('/settings', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(settings),
    });
  },

  // Get email templates
  async getEmailTemplates(token) {
    return await apiCall('/settings/email-templates', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },

  // Update email template
  async updateEmailTemplate(templateId, content, token) {
    return await apiCall(`/settings/email-templates/${templateId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(content),
    });
  },
};

export default {
  users: adminUserService,
  projects: adminProjectService,
  disputes: adminDisputeService,
  analytics: adminAnalyticsService,
  settings: adminSettingsService,
};
