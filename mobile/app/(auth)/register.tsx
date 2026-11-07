import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Building2, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '../../services/auth-context';
import { MobileApi } from '../../services/api';

export default function MobileRegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Incomplete Form', 'Please fill in your name, email, and password.');
      return;
    }

    setLoading(true);
    try {
      const regRes = await MobileApi.register({
        fullName,
        email,
        password,
        role: role.toUpperCase(),
        department,
        currentYear: year,
        university: 'Campus University',
      });

      if (regRes.success) {
        await login(email, password);
        Alert.alert('Account Created', `Welcome to SkillBridge, ${fullName}!`);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Registration Failed', regRes.message || 'Unable to register account.');
      }
    } catch (err: any) {
      Alert.alert('Registration Error', err.message || 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Join StudyBridge</Text>
        <Text style={styles.subtitle}>
          Create your university networking & mentorship profile
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User size={16} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Elena Rostova"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Campus Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={16} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="elena@campus.edu"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={16} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Role selection */}
          <Text style={styles.label}>Primary Role</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'mentee' && styles.roleCardActive]}
              onPress={() => setRole('mentee')}
            >
              <Text style={styles.roleEmoji}>🎓</Text>
              <Text style={styles.roleTitle}>Mentee</Text>
              <Text style={styles.roleDesc}>Find mentors</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'mentor' && styles.roleCardActive]}
              onPress={() => setRole('mentor')}
            >
              <Text style={styles.roleEmoji}>👨‍🏫</Text>
              <Text style={styles.roleTitle}>Mentor</Text>
              <Text style={styles.roleDesc}>Guide peers</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={[styles.inputWrapper, { paddingHorizontal: 12 }]}
              value={department}
              onChangeText={setDepartment}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
            <Text style={styles.submitBtnText}>Create Campus Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.switchAuth}
          onPress={() => router.back()}
        >
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  roleCardActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#ede9fe',
  },
  roleEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  roleDesc: {
    fontSize: 10,
    color: '#64748b',
  },
  submitBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  switchAuth: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 12,
    color: '#64748b',
  },
  switchHighlight: {
    color: '#7c3aed',
    fontWeight: '700',
  },
});
