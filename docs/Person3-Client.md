# Plan A→Z — Personne 3 (Client)

- Rôle: Espace Client (publication, suivi, équipe)
- Références de pages:
  - Dashboard, CreateProject, MyProjects, ProjectDetail, Applications, Team,
    BudgetTracking, Messages/Notifications (shared)

## Objectifs
- Permettre au client de publier, sélectionner, suivre et payer.

## Structure proposée
```
src/
  screens/client/
  components/client/
  navigation/ClientTabs.tsx
  state/
```

## A→Z Étapes
1) CreateProject (form multi-étapes: titre, scope, budget, délais)
2) MyProjects (list + statuts: brouillon, publié, en cours, terminé)
3) ProjectDetail (candidatures, shortlist, attribution)
4) Applications (tri, filtres, accept/refuse)
5) Team (inviter collaborateurs, rôles)
6) BudgetTracking (graph, jalons, paiements, escrow)
7) Notifications (push + in-app)
8) Messages (thread par projet, pièces-jointes)
9) Tests: forms, liste projets, logique d’attribution

## API (exemples)
- POST /client/projects { ... }
- GET  /client/projects
- GET  /client/projects/:id
- POST /client/projects/:id/award { freelancerId }
- GET  /client/projects/:id/applications

## Deliverables
- Publication projets A→Z + suivi budgétaire
- Notifications et messagerie opérationnelles (niveau MVP)

## Definition of Done
- Flux de publication sans friction + validations
- Sélection/attribution robuste et traçable

## Jalons
- S1: CreateProject + MyProjects
- S2: Applications + Award + Messages
- S3: Budget + Notifications + QA
