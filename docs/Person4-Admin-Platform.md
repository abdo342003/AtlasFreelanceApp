# Plan A→Z — Personne 4 (Admin + Plateforme)

- Rôle: Admin + plateforme (qualité, sécurité, livraison)
- Références de pages:
  - Admin: Dashboard, Users, Projects, Disputes, Reports, Settings
  - Shared: Notifications, Messages, PublicProfile

## Objectifs
- Outillage d’admin, observabilité, qualité, CI/CD, cohérence technique.

## Structure proposée
```
src/
  screens/admin/
  components/admin/
  navigation/AdminStack.tsx
  services/
  utils/
```

## A→Z Étapes
1) AdminStack (listes Users/Projects avec recherche/tri)
2) Disputes (création, statut, résolution)
3) Reports (KPI: nombre projets, revenus, litiges, conversions)
4) Settings (feature flags, paramètres plateforme)
5) Notifications service (abstraction push, topics)
6) Logger + Error boundary + Sentry (ou équivalent)
7) Sécurité: validation stricte, sanitization, rate limiting côté client
8) CI/CD Expo EAS (build preview, release channels)
9) Qualité: ESlint + Prettier + TypeScript config (si migration)
10) E2E (Maestro/Detox) scénarios critiques (login, publish, apply, withdraw)

## API (exemples)
- GET /admin/users?query=&page=
- GET /admin/projects?status=
- POST /admin/disputes/:id/resolve { action, notes }

## Conventions équipe (tous)
- Git: `main` (prod), `develop` (int), branches par feature `feat/...`
- PR: description, screenshots, checklist QA, revues croisées (2 pairs)
- Nommage: `PascalCase` composants, `camelCase` fonctions/état
- Dossier commun: `src/components/ui` pour design system

## Deliverables
- Panneau admin utilisable + métriques
- Pipelines CI/CD opérationnels + crash reporting actif

## Definition of Done
- Monitoring de base (logs, erreurs), build EAS
- PR checks (lint, tests) obligatoires

## Jalons
- S1: Admin bases + logger + lint
- S2: Disputes + Reports + EAS
- S3: E2E + hardening + QA finale
