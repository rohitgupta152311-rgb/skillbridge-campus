import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, ExternalLink, Check } from 'lucide-react-native';
import { useAuth } from '../../services/auth-context';
import { Storage } from '../../services/storage';

export default function MobileLinkedInImportScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [fullName, setFullName] = useState('Elena Rostova');
  const [headline, setHeadline] = useState(
    'Computer Science & AI Researcher | LinkedIn OpenID Connect User'
  );
  const [department, setDepartment] = useState('Computer Science');
  const [currentYear, setCurrentYear] = useState('3rd Year');
  const [preserveManual, setPreserveManual] = useState(true);

  const avatarUrl =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
  const email = 'elena.rostova@campus.edu';
  const linkedinUrl = 'https://www.linkedin.com/in/elena-rostova-campus';

  const handleConfirm = async () => {
    const importedUser = {
      id: 'linkedin-user-1',
      email,
      role: 'MENTEE' as const,
      profile: {
        fullName,
        avatarUrl,
        headline,
        department,
        currentYear,
        university: 'State Technological University',
        linkedinUrl,
      },
    };

    await Storage.setItem('sb_auth_token', 'linkedin-jwt-token-77');
    await Storage.setItem('sb_user', JSON.stringify(importedUser));
    setUser(importedUser);

    Alert.alert(
      'Profile Imported',
      'Your profile has been authenticated via LinkedIn OpenID Connect and synchronized with PostgreSQL.'
    );
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <ShieldCheck size={14} color="#0077b5" />
            <Text style={styles.badgeText}>Official LinkedIn OpenID Connect</Text>
          </View>
          <Text style={styles.title}>Review Imported Profile</Text>
          <Text style={styles.desc}>
            StudyBridge imported your official public identity. Please review and confirm your academic details below before saving.
          </Text>
        </View>

        {/* Identity Card */}
        <View style={styles.idCard}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.idMeta}>
            <Text style={styles.idName}>{fullName}</Text>
            <Text style={styles.idEmail}>{email}</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedText}>Verified via LinkedIn</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name (Imported)</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Professional Headline</Text>
            <TextInput
              style={styles.input}
              value={headline}
              onChangeText={setHeadline}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Year of Study</Text>
            <TextInput
              style={styles.input}
              value={currentYear}
              onChangeText={setCurrentYear}
            />
          </View>

          {/* Policy Toggle */}
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setPreserveManual(!preserveManual)}
          >
            <View
              style={[
                styles.checkbox,
                preserveManual && styles.checkboxActive,
              ]}
            >
              {preserveManual && <Check size={14} color="#ffffff" />}
            </View>
            <Text style={styles.toggleLabel}>
              Preserve manual edits. Do not overwrite my future profile edits with LinkedIn data without explicit consent.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleConfirm}>
            <Text style={styles.saveBtnText}>Save & Complete Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284c7',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  desc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  idCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginRight: 12,
  },
  idMeta: {
    flex: 1,
  },
  idName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  idEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  verifiedRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    height: 44,
    fontSize: 13,
    color: '#0f172a',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  toggleLabel: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#64748b',
  },
  saveBtn: {
    backgroundColor: '#0077b5',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
