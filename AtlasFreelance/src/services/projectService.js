// src/services/projectService.js

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  /**
   * Get all projects (marketplace)
   */
  async getAllProjects(filters = {}) {
    try {
      await delay(1000);
      
      const { category, minBudget, maxBudget, search } = filters;
      
      let projects = Array.from({ length: 20 }, (_, i) => ({
        id: `proj-${i + 1}`,
        title: `Projet ${i + 1}`,
        description: `Description détaillée du projet ${i + 1}. Nous recherchons un freelancer compétent pour...`,
        category: ['Développement', 'Design', 'Marketing', 'Rédaction'][i % 4],
        budget: 500 + i * 150,
        duration: `${1 + (i % 4)} ${i % 2 === 0 ? 'semaines' : 'mois'}`,
        status: 'Ouvert',
        proposals: Math.floor(Math.random() * 15),
        clientName: `Client ${i + 1}`,
        clientRating: (3 + Math.random() * 2).toFixed(1),
        postedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['JavaScript', 'React Native', 'Design', 'Marketing'].slice(0, (i % 3) + 2),
      }));
      
      // Apply filters
      if (category) {
        projects = projects.filter(p => p.category === category);
      }
      if (minBudget) {
        projects = projects.filter(p => p.budget >= minBudget);
      }
      if (maxBudget) {
        projects = projects.filter(p => p.budget <= maxBudget);
      }
      if (search) {
        projects = projects.filter(p => 
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get projects',
      };
    }
  },

  /**
   * Get project details
   */
  async getProjectDetails(projectId, token) {
    try {
      await delay(800);
      
      return {
        success: true,
        data: {
          id: projectId,
          title: 'Application Mobile E-commerce',
          description: 'Nous recherchons un développeur React Native expérimenté pour créer une application mobile e-commerce complète...',
          category: 'Développement',
          budget: 15000,
          currency: 'MAD',
          duration: '3 mois',
          status: 'Ouvert',
          proposals: 12,
          clientId: 'client-1',
          clientName: 'Entreprise ABC',
          clientRating: 4.7,
          clientProjects: 23,
          postedDate: '2025-01-05',
          deadline: '2025-04-05',
          skills: ['React Native', 'JavaScript', 'Firebase', 'Redux', 'API Integration'],
          requirements: [
            'Minimum 3 ans d\'expérience en React Native',
            'Portfolio avec au moins 5 applications publiées',
            'Maîtrise de Firebase et API REST',
            'Disponibilité immédiate',
          ],
          attachments: [],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get project details',
      };
    }
  },

  /**
   * Get client's own projects
   */
  async getClientProjects(clientId) {
    try {
      await delay(1000);
      
      // Mock data - remplacer par vrai API call
      const projects = [
        {
          id: '1',
          title: 'Développement application mobile',
          description: 'Création d\'une application mobile pour la gestion de livraisons',
          status: 'open',
          budgetMin: 5000,
          budgetMax: 10000,
          category: 'Développement',
          createdAt: '2025-01-06T10:00:00',
          proposalCount: 12,
          deadline: '2025-03-15',
          skills: ['React Native', 'Firebase', 'API'],
        },
        {
          id: '2',
          title: 'Design de logo et identité visuelle',
          description: 'Besoin d\'un designer pour créer un logo moderne et une charte graphique',
          status: 'in_progress',
          budgetMin: 2000,
          budgetMax: 3500,
          category: 'Design',
          createdAt: '2025-01-03T14:30:00',
          proposalCount: 8,
          deadline: '2025-02-10',
          skills: ['Illustrator', 'Photoshop', 'Branding'],
        },
        {
          id: '3',
          title: 'Rédaction contenu SEO',
          description: 'Rédaction d\'articles optimisés SEO pour site e-commerce',
          status: 'completed',
          budgetMin: 1500,
          budgetMax: 2500,
          category: 'Rédaction',
          createdAt: '2024-12-20T09:15:00',
          proposalCount: 5,
          deadline: '2025-01-20',
          skills: ['SEO', 'Copywriting', 'WordPress'],
        },
        {
          id: '4',
          title: 'Développement site e-commerce',
          description: 'Site vitrine avec système de paiement intégré',
          status: 'open',
          budgetMin: 8000,
          budgetMax: 15000,
          category: 'Développement',
          createdAt: '2025-01-05T16:45:00',
          proposalCount: 15,
          deadline: '2025-04-01',
          skills: ['Shopify', 'WooCommerce', 'Payment Gateway'],
        },
      ];
      
      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get client projects',
      };
    }
  },

  /**
   * Create new project
   */
  async createProject(projectData, token) {
    try {
      await delay(1200);
      
      return {
        success: true,
        data: {
          id: 'proj-' + Date.now(),
          ...projectData,
          status: 'Ouvert',
          proposals: 0,
          postedDate: new Date().toISOString(),
        },
        message: 'Projet créé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create project',
      };
    }
  },

  /**
   * Update project
   */
  async updateProject(projectId, projectData, token) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: {
          id: projectId,
          ...projectData,
        },
        message: 'Projet mis à jour avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update project',
      };
    }
  },

  /**
   * Delete project
   */
  async deleteProject(projectId, token) {
    try {
      await delay(800);
      
      return {
        success: true,
        message: 'Projet supprimé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete project',
      };
    }
  },

  /**
   * Submit proposal for project
   */
  async submitProposal(projectId, proposalData, token) {
    try {
      await delay(1000);
      
      return {
        success: true,
        data: {
          id: 'proposal-' + Date.now(),
          projectId,
          ...proposalData,
          status: 'En attente',
          submittedDate: new Date().toISOString(),
        },
        message: 'Proposition soumise avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to submit proposal',
      };
    }
  },

  /**
   * Get proposals for a project
   */
  async getProjectProposals(projectId, token) {
    try {
      await delay(900);
      
      return {
        success: true,
        data: Array.from({ length: 8 }, (_, i) => ({
          id: `proposal-${i + 1}`,
          freelancerId: `freelancer-${i + 1}`,
          freelancerName: `Freelancer ${i + 1}`,
          freelancerRating: (3.5 + Math.random() * 1.5).toFixed(1),
          proposedBudget: 12000 + i * 500,
          proposedDuration: `${2 + i} mois`,
          coverLetter: `Je suis très intéressé par ce projet. Avec plus de ${3 + i} ans d'expérience...`,
          submittedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          status: ['En attente', 'Acceptée', 'Refusée'][i % 3],
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get proposals',
      };
    }
  },

  /**
   * Accept/Reject proposal
   */
  async updateProposalStatus(proposalId, status, token) {
    try {
      await delay(800);
      
      return {
        success: true,
        message: `Proposition ${status === 'Acceptée' ? 'acceptée' : 'refusée'} avec succès`,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update proposal',
      };
    }
  },
};

export default projectService;
