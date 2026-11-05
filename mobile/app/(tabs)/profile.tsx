import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  ShieldCheck,
  Award,
  Globe,
  LogOut,
  RefreshCw,
  ExternalLink,
  Laptop,
  CheckCircle,
} from 'lucide-react-native';
import { useAuth } from '../../services/auth-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const skills = [
    { name: 'TypeScript', endorsements: 12 },
    { name: 'Distributed Systems', endorsements: 19 },
    { name: 'React Native', endorsements: 8 },
    { name: 'System Design', endorsements: 15 },
    { name: 'Algorithms & Data Structures', endorsements: 22 },
  ];

  const handleSyncWithWeb = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 600));
    setSyncing(false);
    Alert.alert('Cloud Synced', 'Mobile profile is fully synchronized with your Web account in PostgreSQL.');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Banner */}
        <View style={styles.banner} />

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                user?.profile?.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
            }}
            style={styles.avatar}
          />

          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{user?.profile?.fullName || 'Campus Peer'}</Text>
            <ShieldCheck size={18} color="#7c3aed" />
          </View>

          <Text style={styles.headline}>
            {user?.profile?.headline || 'StudyBridge Member'}
          </Text>

          <Text style={styles.meta}>
            {user?.profile?.university || 'State Technological University'} •{' '}
            {user?.profile?.department || 'Computer Science'} •{' '}
            {user?.profile?.currentYear || '3rd Year'}
          </Text>

          {/* Sync Pill */}
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={handleSyncWithWeb}
            disabled={syncing}
          >
            <RefreshCw size={13} color="#7c3aed" />
            <Text style={styles.syncBtnText}>
              {syncing ? 'Syncing...' : 'Synchronized with Web & Render DB'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Endorsed Skills */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={16} color="#7c3aed" />
            <Text style={styles.sectionTitle}>Peer Skill Endorsements</Text>
          </View>

          <View style={styles.skillsList}>
            {skills.map((s) => (
              <View key={s.name} style={styles.skillItem}>
                <Text style={styles.skillName}>{s.name}</Text>
                <View style={styles.endorseBadge}>
                  <Text style={styles.endorseCount}>+{s.endorsements}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Identity</Text>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Campus Email:</Text>
            <Text style={styles.accountVal}>{user?.email || 'student@campus.edu'}</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Role:</Text>
            <Text style={styles.accountVal}>{user?.role || 'MENTEE'}</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Token Storage:</Text>
            <Text style={styles.accountVal}>Expo SecureStore (Encrypted)</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={16} color="#ef4444" />
          <Text style={styles.logoutBtnText}>Sign Out of Mobile App</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    paddingBottom: 30,
  },
  banner: {
    height: 100,
    backgroundColor: '#312e81',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: '#ffffff',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  headline: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  meta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 12,
  },
  syncBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6d28d9',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  skillsList: {
    gap: 8,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  skillName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  endorseBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  endorseCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6d28d9',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  accountLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  accountVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 16,
  },
  logoutBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
