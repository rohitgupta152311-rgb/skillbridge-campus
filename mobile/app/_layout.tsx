import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../services/auth-context';
import { UpdateManager } from '../services/updates';

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Check for updates on startup
    UpdateManager.checkForUpdates().then((res) => {
      if (res.isAvailable && !res.isMandatoryNativeUpdate) {
        console.log('EAS OTA update applied');
      }
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="chat/[id]"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="booking/[mentorId]"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Book Mentorship Session',
              headerTintColor: '#4c1d95',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/linkedin-import"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'LinkedIn Profile Import',
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
