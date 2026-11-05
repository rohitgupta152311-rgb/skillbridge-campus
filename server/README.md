# StudyBridge 2.0 Backend Service

High-performance Express.js + TypeScript + Prisma + PostgreSQL + Socket.IO server powering the StudyBridge Campus Professional Networking & Mentorship Ecosystem.

---

## 🛠️ Architecture & Tech Stack

- **Runtime**: Node.js (v18, v20, v22+)
- **Framework**: Express.js with TypeScript
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Real-Time Layer**: Socket.IO (WebSocket) with room multiplexing and JWT handshake authentication
- **Authentication**: JWT, bcrypt password hashing, OAuth 2.0 (Google, GitHub, LinkedIn)
- **Security**: Helmet, CORS origin restriction, Zod schema validation, Rate Limiting

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL` are configured.

### 3. Generate Prisma Client & Migrate
```bash
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. Start Development Server
```bash
npm run dev
```
The server will boot at `http://localhost:5000` with the healthcheck active at `http://localhost:5000/health`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔑 OAuth 2.0 Setup Guide

### 1. Google OAuth 2.0
1. Navigate to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project > **APIs & Services** > **Credentials**.
3. Create **OAuth 2.0 Client IDs** (Application Type: Web Application).
4. **Authorized JavaScript Origins**:
   - `http://localhost:5173` (Local)
   - `https://studybridge-campus.onrender.com` (Production)
5. **Authorized Redirect URIs**:
   - `http://localhost:5000/api/v1/auth/google/callback` (Local)
   - `https://studybridge-backend.onrender.com/api/v1/auth/google/callback` (Production)
6. Copy `Client ID` to `GOOGLE_CLIENT_ID` and `Client Secret` to `GOOGLE_CLIENT_SECRET`.

### 2. GitHub OAuth
1. Open [GitHub Developer Settings](https://github.com/settings/developers) > **OAuth Apps**.
2. Click **New OAuth App**.
3. **Homepage URL**: `https://studybridge-campus.onrender.com` (or `http://localhost:5173`)
4. **Authorization callback URL**:
   - `http://localhost:5000/api/v1/auth/github/callback` (Local)
   - `https://studybridge-backend.onrender.com/api/v1/auth/github/callback` (Production)
5. Copy keys to `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

### 3. LinkedIn OAuth 2.0 (OpenID Connect)
1. Open [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Create an App and attach the **Sign In with LinkedIn using OpenID Connect** product.
3. Under **Auth** tab > **Authorized redirect URLs for your app**:
   - `http://localhost:5000/api/v1/auth/linkedin/callback` (Local)
   - `https://studybridge-backend.onrender.com/api/v1/auth/linkedin/callback` (Production)
4. Copy credentials to `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`.

---

## 🩺 Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Server & Database health status | No |
| `POST` | `/api/v1/auth/register` | Register new campus account | No |
| `POST` | `/api/v1/auth/login` | Login with email/password | No |
| `GET` | `/api/v1/auth/me` | Fetch active user profile | Yes |
| `GET` | `/api/v1/auth/oauth-status` | OAuth provider readiness | No |
| `GET` | `/api/v1/posts/feed` | Home activity feed | Optional |
| `POST` | `/api/v1/posts` | Create new post | Yes |
| `POST` | `/api/v1/posts/:postId/react` | Like / react to post | Yes |
| `POST` | `/api/v1/posts/:postId/comments` | Add comment | Yes |
| `GET` | `/api/v1/network/summary` | Connections & requests | Yes |
| `GET` | `/api/v1/network/suggestions` | Suggested peer connections | Optional |
| `POST` | `/api/v1/network/request` | Send connection request | Yes |
| `GET` | `/api/v1/profiles/:userId` | Full profile with skills | No |
| `POST` | `/api/v1/profiles/skills/:id/endorse` | Endorse peer skill | Yes |
| `GET` | `/api/v1/communities` | Campus groups & clubs | Optional |
| `GET` | `/api/v1/mentorship/match` | 5-factor matching algorithm | Optional |
| `POST` | `/api/v1/mentorship/sessions/book` | Conflict-checked booking | Yes |
| `POST` | `/api/v1/mentorship/sessions/:id/review`| Verified session review | Yes |
| `GET` | `/api/v1/messages/conversations` | Conversation threads | Yes |
| `GET` | `/api/v1/notifications` | User notifications | Yes |
| `GET` | `/api/v1/admin/metrics` | Platform governance metrics | Admin |
