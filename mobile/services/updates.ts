import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { MobileApi } from './api';

export interface UpdateCheckResult {
  isAvailable: boolean;
  isMandatoryNativeUpdate: boolean;
  isOtaUpdate?: boolean;
  currentVersion: string;
  latestVersion?: string;
  downloadUrl?: string;
  releaseNotes?: string;
  message: string;
}

export const UpdateManager = {
  getCurrentVersion(): string {
    return Constants.expoConfig?.version || '3.0.0';
  },

  async checkForUpdates(): Promise<UpdateCheckResult> {
    const currentVersion = this.getCurrentVersion();

    try {
      // 1. Check Expo EAS Over-The-Air (OTA) channel if running in release build
      if (!__DEV__ && Updates.isEnabled) {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            return {
              isAvailable: true,
              isMandatoryNativeUpdate: false,
              isOtaUpdate: true,
              currentVersion,
              message: 'A new Over-The-Air update has been downloaded. Restart the app now to apply!',
            };
          }
        } catch (otaErr: any) {
          console.warn('[Updates] EAS OTA check skipped or unavailable:', otaErr.message);
        }
      }

      // 2. Query Centralized Backend System Version API
      const versionRes = await MobileApi.checkVersion().catch(() => null);
      if (versionRes && versionRes.data) {
        const data = versionRes.data;
        const serverVersion = data.currentVersion || currentVersion;
        const mandatory = Boolean(data.mandatoryUpdateRequired);
        const downloadUrl = data.downloadUrl || 'https://skillbridge-backend-15a7.onrender.com/downloads/skillbridge-campus-v3.0.0.apk';
        const releaseNotes = data.releaseNotes;

        if (mandatory) {
          return {
            isAvailable: true,
            isMandatoryNativeUpdate: true,
            currentVersion,
            latestVersion: serverVersion,
            downloadUrl,
            releaseNotes,
            message: 'A critical update is required to connect to the campus network.',
          };
        }

        // Compare versions if server version is different from bundled app
        if (serverVersion !== currentVersion) {
          return {
            isAvailable: true,
            isMandatoryNativeUpdate: false,
            currentVersion,
            latestVersion: serverVersion,
            downloadUrl,
            releaseNotes,
            message: `A new version (v${serverVersion}) is available with the latest campus updates.`,
          };
        }
      }

      return {
        isAvailable: false,
        isMandatoryNativeUpdate: false,
        currentVersion,
        message: `StudyBridge Campus is up to date (v${currentVersion}).`,
      };
    } catch (e: any) {
      return {
        isAvailable: false,
        isMandatoryNativeUpdate: false,
        currentVersion,
        message: `Update check completed: ${e.message}`,
      };
    }
  },

  async applyOtaUpdate(): Promise<void> {
    try {
      if (Updates.isEnabled) {
        await Updates.reloadAsync();
      }
    } catch (err) {
      console.warn('[Updates] reloadAsync error:', err);
    }
  },
};
