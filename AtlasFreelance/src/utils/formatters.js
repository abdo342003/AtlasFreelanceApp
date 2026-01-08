// src/utils/formatters.js

/**
 * Format a number as currency (MAD)
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return `${amount.toLocaleString('fr-MA')} MAD`;
};

/**
 * Format a budget range
 */
export const formatBudgetRange = (min, max) => {
  if (!min && !max) return 'Budget non spécifié';
  if (!max) return `À partir de ${formatCurrency(min)}`;
  if (!min) return `Jusqu'à ${formatCurrency(max)}`;
  return `${min.toLocaleString('fr-MA')} - ${max.toLocaleString('fr-MA')} MAD`;
};

/**
 * Format a date to readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If less than 7 days, show relative time
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  // Otherwise show formatted date
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

/**
 * Format relative time (e.g., "il y a 2 heures")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return formatDate(dateString);
};

/**
 * Format plural forms
 */
export const pluralize = (count, singular, plural) => {
  return count <= 1 ? singular : plural;
};

/**
 * Format proposal count
 */
export const formatProposalCount = (count) => {
  if (!count || count === 0) return 'Aucune offre';
  return `${count} ${pluralize(count, 'offre', 'offres')}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
/**
 * Format budget summary
 */
export const formatBudgetSummary = (spent, total) => {
  const percentage = ((spent / total) * 100).toFixed(1);
  return `${formatCurrency(spent)} / ${formatCurrency(total)} (${percentage}%)`;
};

/**
 * Format payment status
 */
export const formatPaymentStatus = (status) => {
  switch (status) {
    case 'released':
      return 'Libéré ✓';
    case 'pending_approval':
      return 'En attente d\'approbation ⏳';
    case 'pending_release':
      return 'Prêt à libérer';
    case 'disputed':
      return 'En litige ⚠️';
    default:
      return status;
  }
};

/**
 * Format application status
 */
export const formatApplicationStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'accepted':
      return 'Acceptée ✓';
    case 'rejected':
      return 'Refusée ✕';
    case 'shortlisted':
      return 'En shortlist ⭐';
    default:
      return status;
  }
};