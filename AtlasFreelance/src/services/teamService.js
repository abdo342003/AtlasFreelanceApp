// src/services/teamService.js

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const teamService = {
  /**
   * Get team members for a client
   */
  async getTeamMembers(clientId) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: [
          {
            id: 'team-1',
            name: 'Leila Mansouri',
            email: 'leila@atlas.com',
            avatar: '👩‍💼',
            role: 'project_manager',
            joinedDate: '2024-11-15',
            permissions: ['view_projects', 'assign_tasks', 'manage_budget'],
          },
          {
            id: 'team-2',
            name: 'Hassan Bennani',
            email: 'hassan@atlas.com',
            avatar: '👨‍💼',
            role: 'assistant',
            joinedDate: '2024-12-01',
            permissions: ['view_projects', 'view_applications'],
          },
        ],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get team members',
      };
    }
  },

  /**
   * Invite a team member
   */
  async inviteTeamMember(email, role, permissions) {
    try {
      await delay(1200);
      
      if (!email || !email.includes('@')) {
        return {
          success: false,
          error: 'Email invalide',
        };
      }

      return {
        success: true,
        message: 'Invitation envoyée avec succès',
        data: {
          id: 'team-' + Date.now(),
          email,
          role,
          status: 'pending_invite',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to invite team member',
      };
    }
  },

  /**
   * Remove a team member
   */
  async removeTeamMember(memberId) {
    try {
      await delay(800);
      
      return {
        success: true,
        message: 'Membre supprimé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to remove team member',
      };
    }
  },

  /**
   * Update team member role
   */
  async updateMemberRole(memberId, newRole) {
    try {
      await delay(800);
      
      return {
        success: true,
        message: 'Rôle mis à jour',
        data: {
          memberId,
          role: newRole,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update member role',
      };
    }
  },

  /**
   * Get role permissions
   */
  getRolePermissions(role) {
    const permissions = {
      owner: ['all'],
      project_manager: ['view_projects', 'assign_tasks', 'manage_budget', 'view_applications'],
      assistant: ['view_projects', 'view_applications'],
      accountant: ['view_projects', 'manage_budget', 'view_payments'],
    };
    return permissions[role] || [];
  },

  /**
   * Get available roles
   */
  getAvailableRoles() {
    return [
      { id: 'project_manager', label: 'Chef de projet' },
      { id: 'assistant', label: 'Assistant' },
      { id: 'accountant', label: 'Comptable' },
    ];
  },
};

export default teamService;
