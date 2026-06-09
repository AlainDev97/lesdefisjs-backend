# HexaJS Backend

API backend de HexaJS, une plateforme de défis JavaScript inspirée de LeetCode et Codewars.

L'API gère l'authentification, les défis, les soumissions de code, l'exécution automatisée des tests, les badges, la progression des utilisateurs, les classements et les fonctionnalités d'administration.

---

# Stack Technique

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Redis
- BullMQ
- Docker
- Zod

---

# Fonctionnalités

## Authentification

- Inscription utilisateur
- Connexion utilisateur
- Authentification JWT
- Cookies HttpOnly sécurisés
- Gestion des rôles
- Rôles USER / ADMIN

### Sécurité

- Validation des emails
- Validation des pseudos
- Validation forte des mots de passe
- Blocage des emails temporaires
- Routes protégées

---

## Défis

- Création de défis
- Modification de défis
- Suppression de défis
- Liste publique des défis
- Consultation d'un défi via son slug
- Gestion de la difficulté

### Niveaux de difficulté

- EASY
- MEDIUM
- HARD

---

## Cas de test

Chaque défi possède plusieurs cas de test.

Fonctionnalités :

- Cas de test visibles
- Cas de test cachés
- Exécution automatique
- Ordre d'exécution configurable

---

## Soumissions de code

Les utilisateurs peuvent soumettre des solutions JavaScript.

Workflow :

1. L'utilisateur soumet son code
2. La soumission est enregistrée
3. Une tâche est ajoutée à la file BullMQ
4. Le worker exécute les tests
5. Les résultats sont enregistrés
6. Le score est calculé
7. Les badges et la progression sont mis à jour

---

## Exécution sécurisée du code

Le code utilisateur est exécuté dans des conteneurs Docker isolés.

Mesures de sécurité :

- Sandbox Docker
- Système de fichiers en lecture seule
- Aucun accès réseau
- Limitation CPU
- Limitation mémoire
- Limitation du nombre de processus
- Timeout d'exécution

Exemple de restrictions Docker :

```bash
--network none
--memory 128m
--cpus 0.5
--pids-limit 64
--read-only
```

---

## Classement

Le classement des utilisateurs est calculé selon :

- Nombre de défis résolus
- Score moyen
- Meilleur score
- Nombre total de soumissions

---

## Système de progression

Les utilisateurs gagnent de l'expérience (XP).

### Titres actuels

- Débutant JS
- Apprenti développeur
- Aventurier du code
- Chasseur de bugs
- Guerrier des algorithmes
- Maître JavaScript

---

## Badges

Badges actuellement disponibles :

| Badge | Description |
|---------|---------|
| FIRST_SUCCESS | Premier défi réussi |
| PERFECT_SCORE | Obtenir un score de 100 % |
| REGULAR | Réaliser 10 soumissions |
| CONFIRMED | Réussir 5 défis différents |
| TOP_PLAYER | Atteindre le Top 3 du classement |

---

# Structure du projet

```txt
src
├── config
├── generated
├── lib
├── middlewares
├── modules
│   ├── auth
│   ├── badges
│   ├── categories
│   ├── challenges
│   ├── leaderboard
│   ├── progression
│   ├── submissions
│   ├── testCases
│   └── users
├── queues
├── routes
├── services
├── types
└── utils
```

---

# Variables d'environnement

```env
NODE_ENV=production

PORT=5000

DATABASE_URL=

JWT_SECRET=

REDIS_HOST=redis
REDIS_PORT=6379

CORS_ORIGIN=

SANDBOX_CONTAINER_DIR=/sandbox-tmp
SANDBOX_HOST_DIR=
```

---

# Installation

## Cloner le projet

```bash
git clone <repository-url>
cd backend
```

## Installer les dépendances

```bash
npm install
```

## Générer le client Prisma

```bash
npx prisma generate
```

## Appliquer les migrations

```bash
npx prisma migrate deploy
```

## Alimenter la base de données

```bash
npm run seed
```

---

# Développement

Lancer l'API :

```bash
npm run dev
```

Lancer le worker :

```bash
npm run worker
```

---

# Production

L'application est conçue pour fonctionner avec Docker.

### Conteneurs

- API
- Worker
- Redis

La base de données PostgreSQL peut être hébergée directement sur le VPS ou dans Docker selon la stratégie de déploiement choisie.

---

# Endpoints API

## Authentification

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Défis

```http
GET /api/challenges
GET /api/challenges/:slug
```

## Soumissions

```http
POST /api/submissions
GET  /api/submissions/me
```

## Classement

```http
GET /api/leaderboard
```

## Progression

```http
GET /api/progression/me
```

## Badges

```http
GET /api/badges/me
```

---

# Sécurité

Protections mises en place :

- Authentification JWT
- Gestion des rôles
- Validation des données avec Zod
- Hashage des mots de passe avec bcrypt
- Rate limiting
- Cooldown entre les soumissions
- Cas de test cachés
- Exécution sécurisée dans Docker
- Protection des variables d'environnement

---

# Roadmap

- Support multi-langages
- Assistant IA
- Amélioration de l'éditeur de code
- Extension du système de badges
- Mise à jour des résultats en temps réel
- Statistiques avancées

---

# Auteur

Développé par Alain (Sparcky).

HexaJS est un projet personnel conçu pour approfondir les compétences en développement backend, sécurité, architecture logicielle et plateformes de programmation.