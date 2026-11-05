import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import {
  Newspaper,
  Users,
  Sparkles,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Newspaper color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color, size }) => <Users color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="mentorship"
        options={{
          title: 'Mentorship',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
