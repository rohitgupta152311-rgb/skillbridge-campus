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
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuth } from '../../services/auth-context';

export default function MobileLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const EMAIL_FORMAT_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSignIn = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    if (!EMAIL_FORMAT_REGEX.test(cleanEmail)) {
      Alert.alert(
        'Invalid Email Format',
        'Please enter a valid email address (e.g. name@nitnagaland.ac.in or student@campus.edu).'
      );
      return;
    }

    setLoading(true);
    await login(cleanEmail, password);
    setLoading(false);
    router.replace('/(tabs)');
  };



  const handleLinkedInOIDC = () => {
    // Open LinkedIn Profile Import Review screen
    router.push('/(auth)/linkedin-import' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Brand Header */}
        <View style={styles.brandBox}>
          <View style={styles.logoBadge}>
            <GraduationCap size={28} color="#ffffff" />
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.brandName}>StudyBridge</Text>
            <View style={styles.versionPill}>
              <Text style={styles.versionText}>Mobile 3.0</Text>
            </View>
          </View>
          <Text style={styles.tagline}>Campus Networking & Peer Mentorship</Text>
        </View>

        {/* Social Logins */}
        <View style={styles.socialBox}>
          <TouchableOpacity
            style={styles.linkedInBtn}
            onPress={handleLinkedInOIDC}
          >
            <Text style={styles.linkedInBtnText}>Continue with LinkedIn</Text>
          </TouchableOpacity>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Alert.alert('Campus SSO', 'Please sign in with your verified campus email and password.')}
            >
              <Text style={styles.socialBtnText}>Google SSO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => Alert.alert('Campus SSO', 'Please sign in with your verified campus email and password.')}
            >
              <Text style={styles.socialBtnText}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR SIGN IN WITH CAMPUS EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Campus Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={16} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="student@nitnagaland.ac.in"
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
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <EyeOff size={16} color="#94a3b8" />
                ) : (
                  <Eye size={16} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.signInBtn}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.signInBtnText}>
              {loading ? 'Authenticating...' : 'Sign In to Campus'}
            </Text>
          </TouchableOpacity>
        </View>



        {/* Register Link */}
        <TouchableOpacity
          style={styles.switchAuth}
          onPress={() => router.push('/(auth)/register' as any)}
        >
          <Text style={styles.switchText}>
            Don't have an account?{' '}
            <Text style={styles.switchHighlight}>Create account</Text>
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
    justifyContent: 'center',
  },
  brandBox: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  versionPill: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6d28d9',
  },
  tagline: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  socialBox: {
    gap: 10,
    marginTop: 12,
  },
  linkedInBtn: {
    backgroundColor: '#0077b5',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  linkedInBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
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
  eyeBtn: {
    padding: 6,
  },
  signInBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  signInBtnText: {
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
