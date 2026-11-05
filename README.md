# SkillBridge 3.0 – Complete Web + Mobile Campus Networking & Mentorship Ecosystem

[![CI/CD Deployment](https://github.com/skillbridge/campus/actions/workflows/deploy.yml/badge.svg)](https://github.com/skillbridge/campus/actions)
[![EAS Mobile OTA Updates](https://github.com/skillbridge/campus/actions/workflows/mobile-eas.yml/badge.svg)](https://github.com/skillbridge/campus/actions)
[![Backend Status](https://img.shields.io/badge/Render-Backend%20Live-brightgreen)](https://skillbridge-backend.onrender.com/health)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2052-blue.svg)](https://expo.dev)

SkillBridge 3.0 is a complete, production-grade professional networking and peer-to-peer mentorship ecosystem designed specifically for university students, faculty, and alumni. It unifies the best concepts of **LinkedIn** (professional networking, verified skill endorsements, home activity feed), **Discord** (real-time chat, student communities), **Calendly** (conflict-aware calendar scheduling), and **Upwork** (skill discovery and verified mentor reputation).

---

## 🏛️ System Architecture

```mermaid
graph TD
    Web["React 19 + Vite Web Application<br/>(Tailwind CSS, Lucide, Recharts)"]
    Mobile["React Native + Expo Mobile App<br/>(iOS & Android via Expo Router)"]
    API["Centralized Express.js + TypeScript Backend<br/>(Render Web Service / Node.js)"]
    DB[("Authoritative PostgreSQL Database<br/>(Render Managed Postgres via Prisma ORM)")]
    Sockets["Socket.IO Server<br/>(Real-Time Messaging & Presence)"]
    CloudStorage["Cloudinary Object Storage<br/>(Persistent Images & Attachments)"]
    OAuth["OAuth Providers<br/>(LinkedIn OIDC, Google SSO, GitHub)"]

    Web -->|REST API Requests| API
    Mobile -->|REST API Requests| API
    Web <-->|WebSocket Events| Sockets
    Mobile <-->|WebSocket Events| Sockets
    API -->|Prisma ORM (29 Models)| DB
    API -->|Official Scopes| OAuth
    API -->|Signed Streaming Uploads| CloudStorage
```

### Shared Database & Unified User Experience
All applications connect to the **same centralized backend and PostgreSQL database**. A student registering or updating their profile on the website will instantly see their changes, posts, connections, and mentorship bookings reflected in the mobile application.

---

## 🌟 Key Features in SkillBridge 3.0

### 1. Official LinkedIn Login & Automatic Profile Import (7-Step Flow)
SkillBridge adheres strictly to official LinkedIn Developer policies:
- **Zero Scraping & Minimal Scopes**: Uses official OpenID Connect scopes (`openid`, `profile`, `email`).
- **Profile Import**: Automatically imports verified photo, name, email, headline, and public profile link.
- **Review & Edit Modal**: Users preview imported information, specify their university department/year, and edit fields before saving.
- **Consent Protection**: Includes a *"Preserve manual edits"* policy ensuring subsequent logins do not overwrite custom updates.
- **Multi-Provider Account Linking**: Link Google, GitHub, and LinkedIn to a single account without duplicates.

### 2. Cross-Platform Mobile Application (`mobile/`)
- Built with **React Native**, **Expo SDK 52**, and **Expo Router**.
- 5 Native Tabs:
  1. **Home Feed**: Campus updates, academic questions, project collaboration showcases, likes, and comments.
  2. **Network**: Connection management, pending invitations, and student suggestions.
  3. **Mentorship**: 5-Factor AI Matchmaking engine (Topic 35%, Availability 25%, Rating 20%, Skills 10%, Preference 10%).
  4. **Messages**: 1-on-1 real-time peer study chats with typing and online indicators.
  5. **Profile**: Verified academic credentials, peer skill endorsements, and account sync indicators.
- **Expo SecureStore**: Encrypted token and credential storage.

### 3. Automatic Updates & Zero Reinstallation
- **Backend & Web**: Deployed automatically via Render Blueprint (`render.yaml`) and GitHub Actions.
- **Mobile Over-The-Air (OTA) Updates**: Compatible JavaScript and asset changes publish directly via **Expo EAS Update** without requiring users to manually reinstall the app.
- **Runtime Version Check**: Graceful version-check alert only prompts users to visit the App Store / Play Store when a native binary change is required.

### 4. Persistent Cloud Object Storage
- File uploads (profile avatars, cover photos, project attachments, and feed post images) are streamed directly to **Cloudinary** or S3-compatible persistent storage.
- Strict MIME type validation (JPEG, PNG, WebP) and 5MB size limits.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ (optional for live backend; local fallback engine handles offline demos)

---

### Step 1: Start the Centralized Backend Server
```powershell
cd server
npm install
npx prisma generate
npm run build
npm start
```
- Health Check: `http://localhost:5000/health` (or `http://localhost:5000/api/health`)
- API Base: `http://localhost:5000/api/v1`

---

### Step 2: Start the Web Application
```powershell
npm install
npm run build
npm run dev
```
- Web Application URL: `http://localhost:5173/`

---

### Step 3: Start the Mobile Application
```powershell
cd mobile
npm install
npx expo start
```
- Press **`a`** to launch on Android Emulator.
- Press **`i`** to launch on iOS Simulator.
- Press **`w`** to launch in Web browser for rapid UI testing.

---

## 🔑 1-Click Demo Credentials

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Mentee** | `alex.student@campus.edu` | `demo1234` | Campus Feed, Network, Find Mentors, Smart Matchmaker, Book Sessions, Chat |
| **Mentor** | `sarah.mentor@campus.edu` | `demo1234` | Feed, Network, Mentor Dashboard, Availability Slots, Reviews, Chat |
| **Admin** | `admin@campus.edu` | `admin1234` | User Directory, Mentor Verification, Safety Reports, Platform Governance |

*(All demo credentials have 1-click quick-login buttons on both Web and Mobile)*

---

## ☁️ Deployment Configuration

### 1. Render Blueprint (`render.yaml`)
To deploy the entire stack on Render:
1. Push repository to GitHub.
2. In Render Dashboard, click **New +** > **Blueprint** and select this repository.
3. Render automatically sets up:
   - **`skillbridge-postgres`**: Managed PostgreSQL database.
   - **`skillbridge-backend`**: Node/Express Web Service with health check `/health`.
   - **`skillbridge-frontend`**: Static Site hosting the React + Vite web client.

### 2. Expo EAS Build & OTA Publishing
```bash
# Configure project with EAS
cd mobile
eas login
eas build:configure

# Publish instant OTA update to production (no app store review required)
eas update --channel production --message "Deploy latest UI and matching engine"

# Build Google Play (.aab) or iOS (.ipa)
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

## 📄 License & Attribution
SkillBridge 3.0 was designed for the CIH-008 Smart Peer-to-Peer Tutoring and Mentorship Matchmaker challenge.
All rights reserved © 2026 SkillBridge Technologies.
