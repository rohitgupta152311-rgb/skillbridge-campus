# StudyBridge 3.0 – Production Deployment & Infrastructure Guide

This guide details the complete production deployment process for the StudyBridge 3.0 ecosystem across **Render**, **GitHub Actions**, **LinkedIn Developer Portal**, and **Expo EAS**.

---

## 1. Render Deployment (Backend, Database & Web)

The root repository contains a validated [`render.yaml`](./render.yaml) blueprint specification.

### Automatic Provisioning via Render Blueprint:
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository (`studybridge-campus`).
4. Render automatically parses `render.yaml` and provisions:
   - **`skillbridge-postgres`**: PostgreSQL 16 database.
   - **`studybridge-backend`**: Node.js/Express Web Service.
   - **`studybridge-frontend`**: Static Site hosting the React application.
5. In the Render dashboard under `studybridge-backend` > **Environment**, provide your production OAuth keys.

---

## 2. LinkedIn OpenID Connect OAuth Registration

To enable the official LinkedIn Profile Auto-Import flow:

1. Visit the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Click **Create App**:
   - App Name: `StudyBridge Campus`
   - Company: Link your university or student organization page.
   - Privacy Policy URL: `https://studybridge-campus.onrender.com/privacy`
3. Under the **Products** tab, request access to:
   - **Sign In with LinkedIn using OpenID Connect** (Approved instantly for all developer accounts).
4. Under the **Auth** tab, add your **Authorized Redirect URLs**:
   - Development: `http://localhost:5000/api/v1/auth/linkedin/callback`
   - Production: `https://studybridge-backend.onrender.com/api/v1/auth/linkedin/callback`
5. Copy your **Client ID** and **Client Secret** and add them to Render environment variables:
   - `LINKEDIN_CLIENT_ID`
   - `LINKEDIN_CLIENT_SECRET`
   - `LINKEDIN_CALLBACK_URL`

---

## 3. Google Workspace & GitHub OAuth Setup

### Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/) > **APIs & Services** > **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add Authorized Redirect URI:
   - `https://studybridge-backend.onrender.com/api/v1/auth/google/callback`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Render.

### GitHub Developer Settings:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers) > **OAuth Apps** > **New OAuth App**.
2. Authorization callback URL:
   - `https://studybridge-backend.onrender.com/api/v1/auth/github/callback`
3. Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Render.

---

## 4. Cloudinary Persistent Object Storage

To store student profile photos, project screenshots, and campus feed media permanently without saving them to server disk:

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Locate your **Cloud Name**, **API Key**, and **API Secret** in the dashboard.
3. Configure them in Render:
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`

---

## 5. Mobile App Distribution & EAS Over-The-Air (OTA) Updates

The mobile app is configured with **Expo Application Services (EAS)**:

### 1. Build Production App Store Binaries:
```bash
cd mobile

# Generate Android App Bundle (.aab) for Google Play Console:
eas build --platform android --profile production

# Generate iOS Application (.ipa) for Apple App Store:
eas build --platform ios --profile production
```

### 2. Push Instant OTA Updates (No App Store Review Required):
For all compatible JavaScript, UI, and styling updates:
```bash
eas update --channel production --message "Update UI layout and matchmaker weights"
```
The mobile application will download and apply this update seamlessly upon next launch.

---

## 6. GitHub Actions CI/CD Pipeline

The repository includes two automated workflows in `.github/workflows/`:
- **`deploy.yml`**: Automatically verifies TypeScript types, builds the production bundle, runs test suites, and triggers the Render deploy hook on push to `main`.
- **`mobile-eas.yml`**: Automatically publishes an EAS OTA update to the production channel whenever files in `mobile/**` are merged to `main`.

### Required GitHub Secrets (Repository Settings > Secrets & Variables > Actions):
- `RENDER_BACKEND_DEPLOY_HOOK`: Deploy hook URL from Render Web Service.
- `RENDER_FRONTEND_DEPLOY_HOOK`: Deploy hook URL from Render Static Site.
- `EXPO_TOKEN`: Personal access token generated from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens).
