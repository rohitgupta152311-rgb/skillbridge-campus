# StudyBridge 3.0 Mobile Application (React Native & Expo)

StudyBridge Mobile is a cross-platform (Android & iOS) peer-to-peer tutoring and academic networking application built with **React Native**, **Expo (SDK 52)**, and **Expo Router**.

It communicates with the centralized **StudyBridge Render Backend** and shares the exact same **PostgreSQL database** as the web client.

---

## 📱 Features

- **Cross-Platform**: Unified codebase for Android (Google Play) and iOS (Apple App Store).
- **LinkedIn OpenID Connect Authentication**: Authenticate with official LinkedIn scopes (`openid`, `profile`, `email`) and review imported headline, avatar, and name before saving.
- **5 Native Tabs**:
  1. **Feed**: Interactive campus activity feed with post creation, likes, comments, and pull-to-refresh.
  2. **Network**: Connection requests, peer suggestions, and mutual connection counts.
  3. **Mentorship**: 5-Factor AI Matchmaking engine (Topic 35%, Availability 25%, Rating 20%, Skills 10%, Preference 10%) with direct booking.
  4. **Messages**: 1-on-1 real-time peer study chats with typing and online presence indicators.
  5. **Profile**: Verified academic credentials, peer skill endorsements, and account sync indicators.
- **EAS OTA Updates**: Compatible JavaScript and asset updates deployed instantly over-the-air via `eas update` without requiring manual app store reinstallations.
- **Expo SecureStore**: Encrypted token and session credential storage.

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start the Expo Development Server
```bash
npx expo start
```
- Press `a` to run on Android Emulator / Device.
- Press `i` to run on iOS Simulator (macOS required).
- Press `w` to run on Web Browser for testing.

### 3. Backend API Connection
- **Android Emulator**: Automatically routes to `http://10.0.2.2:5000/api/v1` to communicate with the host backend.
- **iOS Simulator / Physical Device**: Update `extra.productionApiUrl` in `app.json` or set to your Render deployment URL: `https://studybridge-api.onrender.com/api/v1`.

---

## 📦 Building Native Binaries (EAS Build)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Configure Project
```bash
eas build:configure
```

### 3. Generate Android APK / AAB
```bash
# Preview internal APK
eas build --platform android --profile preview

# Production Google Play App Bundle (.aab)
eas build --platform android --profile production
```

### 4. Generate iOS Build (.ipa)
```bash
eas build --platform ios --profile production
```

---

## 🔄 Publishing Automatic OTA Updates (No App Store Reinstall)

When making JavaScript, UI, or styling changes that do not alter native SDK dependencies:

```bash
# Publish instant OTA update to production channel
eas update --branch production --message "Update 5-factor matching weights and UI tweaks"
```

The mobile app automatically checks for updates on startup via `UpdateManager.checkForUpdates()` and applies them seamlessly.
