# Guide de Design Unifié — AtlasFreelanceApp

Ce document est la source de vérité unique pour le design de l'application AtlasFreelance. Il unifie les styles pour les 4 pôles (Public/Auth, Freelancer, Client, Admin) et assure une cohérence parfaite entre le web et le mobile (React Native).

---

## 1. Identité Visuelle

### Palette de Couleurs
Nous utilisons une palette moderne et accessible. Ne jamais utiliser de valeurs hexadécimales brutes dans le code, toujours passer par les tokens.

| Token | Valeur (Light) | Valeur (Dark) | Usage |
|-------|---------------|---------------|-------|
| `primary` | `#0EA5E9` (Sky Blue) | `#38BDF8` | Action principale, header, liens |
| `on-primary` | `#FFFFFF` | `#0B1020` | Texte sur fond primaire |
| `secondary` | `#22C55E` (Emerald) | `#22C55E` | Actions secondaires, succès |
| `accent` | `#F59E0B` (Amber) | `#F59E0B` | Mise en avant, warning |
| `bg` | `#F8FAFC` (Slate 50) | `#0F172A` | Fond de page |
| `surface` | `#FFFFFF` | `#1E293B` | Fond de carte, modal, input |
| `text-primary` | `#0F172A` | `#F8FAFC` | Titres, texte principal |
| `text-secondary` | `#475569` | `#CBD5E1` | Sous-titres, placeholders |
| `border` | `#E2E8F0` | `#334155` | Bordures, séparateurs |
| `danger` | `#EF4444` | `#EF4444` | Erreurs, suppression |

### Typographie
Police système par défaut pour la performance (`System UI`, `San Francisco`, `Roboto`).

| Token | Taille | Poids | Usage |
|-------|--------|-------|-------|
| `title` | 32px | 700 (Bold) | H1, Grands titres |
| `subtitle` | 18px | 600 (SemiBold) | H2, Titres de cartes |
| `body` | 16px | 400 (Regular) | Paragraphes, inputs |
| `caption` | 13px | 400 (Regular) | Labels, métadonnées |

### Espacements & Rayons
Système de grille de 4px.

| Token | Valeur | Usage |
|-------|--------|-------|
| `space-xs` | 4px | Petit gap |
| `space-s` | 8px | Padding interne boutons/inputs |
| `space-m` | 12px | Gap standard, margin |
| `space-l` | 16px | Padding conteneurs |
| `space-xl` | 24px | Padding sections |
| `radius-sm` | 8px | Inputs, petits boutons |
| `radius-md` | 12px | Cartes, boutons standards |
| `radius-lg` | 16px | Modales, grandes cartes |
| `radius-full` | 9999px | Badges, avatars, boutons ronds |

---

## 2. Composants UI (Web & React Native)

### Boutons (`.btn`)
- **Primary**: Fond `primary`, texte `on-primary`. Pour l'action principale de la page.
- **Secondary**: Fond `secondary`, texte `on-secondary`. Pour les actions alternatives.
- **Outline**: Fond transparent, bordure `border`, texte `text-primary`. Pour annuler ou actions tertiaires.
- **Full**: Largeur 100%.

### Cartes (`.card`)
Conteneur principal pour le contenu.
- Fond `surface`
- Bordure 1px `border`
- Ombre `shadow-card` (`0 4px 12px rgba(0,0,0,0.08)`)
- Radius `radius-md` ou `radius-lg`

### Inputs (`.input`)
- Fond `surface`
- Bordure 1px `border`
- Radius `radius-sm`
- Focus: Bordure `primary` + Ring (ombre portée)

### Badges (`.badge`)
Pour les statuts et tags.
- Radius `radius-full`
- Fond: Couleur avec opacité 10% (ex: `rgba(14, 165, 233, 0.1)`)
- Texte: Couleur pleine (ex: `primary`)

---

## 3. Conventions de Code

### CSS / Web
Utiliser les variables CSS définies dans `:root`.
```css
.my-component {
  padding: var(--space-m);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}
```

### React Native
Utiliser un objet de thème centralisé (ex: `src/theme/index.ts`).
```typescript
const theme = {
  colors: {
    primary: '#0EA5E9',
    surface: '#FFFFFF',
    // ...
  },
  spacing: {
    m: 12,
    l: 16,
  },
  // ...
}

// Usage
<View style={{ padding: theme.spacing.m, backgroundColor: theme.colors.surface }}>
```

### Mode Sombre
- **Web**: Ajouter la classe `.theme-dark` sur le `<body>`. Les variables CSS s'adaptent automatiquement.
- **Mobile**: Utiliser le hook `useColorScheme()` et basculer les valeurs du thème.

---

## 4. Répartition par Équipe

### Personne 1 : Public & Auth
- **Focus**: Landing page, Login, Signup, Onboarding.
- **Composants clés**: Formulaires (`Input`, `Button`), Cards d'info.
- **Style**: Accueillant, clair, rassurant.

### Personne 2 : Freelancer
- **Focus**: Recherche de projets, Profil, Candidatures.
- **Composants clés**: Listes de projets (`Card`), Filtres (`Badge`), Profil (`Avatar`).
- **Style**: Efficace, dense en information mais lisible.

### Personne 3 : Client
- **Focus**: Création de projet, Gestion des candidatures.
- **Composants clés**: Wizard de création (Multi-step form), Tableaux de bord.
- **Style**: Professionnel, orienté action.

### Personne 4 : Admin
- **Focus**: Dashboard global, Gestion utilisateurs/litiges.
- **Composants clés**: Tableaux de données, Graphiques, Actions rapides.
- **Style**: Utilitaire, haute densité.

---

## 5. Ressources

- **Démo Interactive**: Ouvrir `demo-moderne-complete.html` dans votre navigateur pour voir tous les composants en action.
- **PDF Guide**: `docs/Unified-Design-Guide.pdf` (version imprimable).
