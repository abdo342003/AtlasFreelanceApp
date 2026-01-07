// src/utils/validation.js
export const validators = {
  required: (value, fieldName = 'Ce champ') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} est requis`;
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email invalide';
    }
    return null;
  },

  minLength: (value, min) => {
    if (value.length < min) {
      return `Minimum ${min} caractères requis`;
    }
    return null;
  },

  maxLength: (value, max) => {
    if (value.length > max) {
      return `Maximum ${max} caractères autorisés`;
    }
    return null;
  },

  password: (value) => {
    if (value.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!/[a-z]/.test(value)) {
      return 'Le mot de passe doit contenir au moins une minuscule';
    }
    if (!/[0-9]/.test(value)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    return null;
  },

  phone: (value) => {
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Numéro de téléphone invalide';
    }
    return null;
  },

  confirmPassword: (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  },
};

export function validateForm(values, rules) {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
