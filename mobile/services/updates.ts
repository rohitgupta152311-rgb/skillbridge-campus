import * as Updates from 'expo-updates';
import { MobileApi } from './api';

export interface UpdateCheckResult {
  isAvailable: boolean;
  isMandatoryNativeUpdate: boolean;
  message: string;
}

export const UpdateManager = {
  async checkForUpdates(): Promise<UpdateCheckResult> {
    try {
      // 1. Check Backend Version API for minimum native version requirement
      const versionRes = await MobileApi.checkVersion().catch(() => null);
      if (versionRes && versionRes.data?.mandatoryUpdateRequired) {
        return {
          isAvailable: true,
          isMandatoryNativeUpdate: true,
          message: 'A critical native update is required. Please update from the App Store / Play Store.',
        };
      }

      // 2. Check Expo EAS OTA Update channel in production
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          return {
            isAvailable: true,
            isMandatoryNativeUpdate: false,
            message: 'A new application update is ready! Restart to apply.',
          };
        }
      }

      return {
        isAvailable: false,
        isMandatoryNativeUpdate: false,
        message: 'Application is running the latest version.',
      };
    } catch (e: any) {
      return {
        isAvailable: false,
        isMandatoryNativeUpdate: false,
        message: `Update check completed: ${e.message}`,
      };
    }
  },

  async applyOtaUpdate(): Promise<void> {
    try {
      await Updates.reloadAsync();
    } catch {
      // Ignore if dev
    }
  },
};
