# Plan A→Z — Personne 1 (Public + Auth)

- Rôle: Pages publiques + Authentification (Expo/React Native)
- Références de pages:
  - Public: Landing, HowItWorks, About, Pricing
  - Auth: SignupRole, SignupFreelancer, SignupClient, Login, ForgotPassword, VerifyEmail

## Objectifs
- Fournir le flux d’onboarding complet et les pages publiques.
- Mettre en place la navigation d’entrée de l’app et le thème global.

## Mise en place (env)
- Node 18+, Expo SDK 54
- Commandes:
```bash
npm install
npm run start
```

## Structure proposée
```
src/
  screens/
    public/
    auth/
  components/
    ui/
  navigation/
    PublicStack.tsx
    AuthStack.tsx
  theme/
    index.ts
```

## A→Z Étapes
1) Design système et thème global (couleurs, typo, boutons, inputs)
2) Navigation: `PublicStack` (Landing, HowItWorks, About, Pricing)
3) Navigation: `AuthStack` (Signup*, Login, ForgotPassword, VerifyEmail)
4) Formulaires d’inscription (rôle, client/freelancer) avec validation
5) Login + persistance de session (SecureStore/AsyncStorage)
6) Mot de passe oublié (écran + appel API + toasts)
7) Vérification email (lien deep link + état compte)
8) États de chargement, erreurs, empty states
9) Accessibilité (labels, contraste) et i18n (fr/EN si besoin)
10) Tests: Jest + React Native Testing Library (form validations)

## API (exemples)
- POST /auth/signup { role, email, password }
- POST /auth/login { email, password }
- POST /auth/forgot-password { email }
- GET  /auth/verify-email?token=...

## Deliverables
- Écrans finalisés + navigation fonctionnelle
- Hooks/form validations réutilisables
- Tests unitaires >= 70% des formulaires

## Definition of Done
- UX fluide, erreurs gérées, pas de warnings console
- Deep links de vérif email OK sous Expo
- PR revues et mergées dans `develop`

## Jalons
- S1: PublicStack + thème
- S2: AuthStack + forms + tests
- S3: QA croisée + stabilisation
