# Plan A→Z — Personne 2 (Freelancer)

- Rôle: Espace Freelance (productivité et candidature)
- Références de pages:
  - Dashboard, Projects, ProjectDetail, Apply, Applications, ProjectsActive,
    Workspace, Profile, Wallet, Withdraw, Reviews

## Objectifs
- Permettre au freelance de parcourir, candidater, exécuter et être payé.

## Structure proposée
```
src/
  screens/freelancer/
  components/freelancer/
  navigation/FreelancerTabs.tsx
  state/
```

## A→Z Étapes
1) Tabs/Stack `FreelancerTabs` (Dashboard, Projects, Active, Profile)
2) Projects list + filtres + infinis (FlatList, pagination)
3) ProjectDetail (description, budget, skills, client)
4) Apply (form offre + fichiers, validation, toasts)
5) Applications (statuts: envoyé, shortlist, refusé)
6) Workspace (tâches, livrables, messages, pièces-jointes)
7) Wallet + Withdraw (historique, solde, retrait)
8) Reviews (laisser et voir avis)
9) Gestion d’état: Zustand/Redux (offres, projets, wallet)
10) Offline basique (cache dernière liste projets)
11) Tests: logique d’état + rendu listes/détails

## API (exemples)
- GET /projects?query=&page=
- GET /projects/:id
- POST /projects/:id/apply { coverLetter, bid, attachments[] }
- GET /me/applications
- GET /me/wallet
- POST /me/withdraw { amount }

## Deliverables
- Expérience freelance complète (de la recherche au retrait)
- État global stable + synchro API
- Tests unitaires clés (state, lists, forms)

## Definition of Done
- Pagination fluide, erreurs réseau gérées
- Upload documents stable (Expo DocumentPicker/Sharing)
- Aucun crash en navigation

## Jalons
- S1: Lists + Details + Apply
- S2: Workspace + Wallet
- S3: QA + optimisations
