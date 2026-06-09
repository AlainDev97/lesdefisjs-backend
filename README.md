# HexaJS Backend

Backend API for HexaJS, a JavaScript coding challenge platform inspired by LeetCode and Codewars.

The API handles authentication, challenges, submissions, automated code execution, badges, progression, leaderboards, and administrative features.

---

# Tech Stack

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

# Features

## Authentication

- User registration
- User login
- JWT authentication
- Secure HttpOnly cookies
- Role-based authorization
- USER / ADMIN roles

### Security

- Email validation
- Username validation
- Strong password validation
- Temporary email blocking
- Protected routes

---

## Challenges

- Challenge creation
- Challenge update
- Challenge deletion
- Public challenge listing
- Challenge details by slug
- Difficulty management

### Difficulty levels

- EASY
- MEDIUM
- HARD

---

## Test Cases

Each challenge contains multiple test cases.

Features:

- Visible test cases
- Hidden test cases
- Automatic execution
- Ordered execution

---

## Code Submissions

Users can submit JavaScript solutions.

Submission flow:

1. User submits code
2. Submission is stored
3. Job is added to BullMQ queue
4. Worker executes tests
5. Results are stored
6. Score is calculated
7. Badges and progression are updated

---

## Secure Sandbox Execution

User code is executed inside isolated Docker containers.

Security measures:

- Docker sandbox
- Read-only filesystem
- No network access
- CPU limitation
- Memory limitation
- Process limitation
- Execution timeout

Example Docker restrictions:

```bash
--network none
--memory 128m
--cpus 0.5
--pids-limit 64
--read-only
```

---

## Leaderboard

The leaderboard ranks users according to:

- Solved challenges
- Average score
- Best score
- Number of submissions

---

## Progression System

Users gain experience points (XP).

### Current titles

- Débutant JS
- Apprenti développeur
- Aventurier du code
- Chasseur de bugs
- Guerrier des algorithmes
- Maître JavaScript

---

## Badges

Current badges:

| Badge | Description |
|---------|---------|
| FIRST_SUCCESS | First successful challenge |
| PERFECT_SCORE | Score 100% |
| REGULAR | 10 submissions |
| CONFIRMED | 5 different challenges solved |
| TOP_PLAYER | Top 3 leaderboard |

---

# Project Structure

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

# Environment Variables

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

## Clone repository

```bash
git clone <repository-url>
cd backend
```

## Install dependencies

```bash
npm install
```

## Generate Prisma client

```bash
npx prisma generate
```

## Run migrations

```bash
npx prisma migrate deploy
```

## Seed database

```bash
npm run seed
```

---

# Development

Start API:

```bash
npm run dev
```

Start Worker:

```bash
npm run worker
```

---

# Production

The application is designed to run with Docker.

### Containers

- API
- Worker
- Redis

The PostgreSQL database can run directly on the VPS or inside Docker depending on the deployment strategy.

---

# API Endpoints

## Auth

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Challenges

```http
GET /api/challenges
GET /api/challenges/:slug
```

## Submissions

```http
POST /api/submissions
GET  /api/submissions/me
```

## Leaderboard

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

# Security

Implemented protections:

- JWT Authentication
- Role-based authorization
- Zod validation
- Password hashing with bcrypt
- Rate limiting
- Submission cooldown
- Hidden test cases
- Docker sandbox execution
- Environment variable protection

---

# Roadmap

- Multi-language support
- AI assistant
- Code editor improvements
- Achievement system expansion
- Real-time submission updates
- Advanced analytics

---

# Author

Developed by Alain (Sparcky)

HexaJS is a personal project focused on learning, security, software architecture, and coding challenge platforms.