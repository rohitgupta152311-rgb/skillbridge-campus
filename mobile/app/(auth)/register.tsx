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
  Linking,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock } from 'lucide-react-native';
import { MobileApi } from '../../services/api';
import { useAuth } from '../../services/auth-context';

export default function MobileRegisterScreen() {
  const router = useRouter();
  const { loginWithGoogle, loginWithGitHub, sendRegistrationOtp, verifyRegistrationOtp } = useAuth();
  const [loading, setLoading] = useState(false);

  // Google Instant Registration Modal
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleFullName, setGoogleFullName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // GitHub Instant Registration Modal
  const [githubModalVisible, setGithubModalVisible] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubEmail, setGithubEmail] = useState('');
  const [githubChecking, setGithubChecking] = useState(false);
  const [githubSigningIn, setGithubSigningIn] = useState(false);
  const [githubProfile, setGithubProfile] = useState<{
    login: string;
    name?: string;
    avatarUrl?: string;
    bio?: string;
    publicRepos?: number;
    followers?: number;
  } | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);

  // 2FA Email Verification State
  const [twoFactorVisible, setTwoFactorVisible] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorDevCode, setTwoFactorDevCode] = useState<string | null>(null);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorVerifying, setTwoFactorVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'mentee' | 'mentor'>('mentee');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  const EMAIL_FORMAT_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 2FA Resend Countdown Timer
  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRegister = async () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      Alert.alert('Incomplete Form', 'Please fill in your full name, email, and password.');
      return;
    }

    if (!EMAIL_FORMAT_REGEX.test(cleanEmail)) {
      Alert.alert(
        'Invalid Email Format',
        'Please enter a valid campus or student email address (e.g. name@nitnagaland.ac.in or student@campus.edu).'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const otpRes = await sendRegistrationOtp({
        email: cleanEmail,
        password,
        fullName: cleanName,
        role: role.toUpperCase(),
        department,
        currentYear: year,
        university: 'National Institute of Technology (NIT) Nagaland',
      });

      if (otpRes.success) {
        setTwoFactorDevCode(otpRes.data?.devCode || null);
        setTwoFactorVisible(true);
        setResendTimer(60);
      } else {
        Alert.alert('Registration Error', otpRes.message || 'Unable to dispatch verification code.');
      }
    } catch (err: any) {
      Alert.alert('Registration Error', err.message || 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    const cleanCode = twoFactorCode.trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) {
      setTwoFactorError('Please enter the full 6-digit code.');
      return;
    }

    setTwoFactorVerifying(true);
    setTwoFactorError(null);
    try {
      const res = await verifyRegistrationOtp({
        email: email.trim().toLowerCase(),
        code: cleanCode,
        registrationData: {
          fullName: fullName.trim(),
          password,
          role: role.toUpperCase(),
          department,
          currentYear: year,
          university: 'National Institute of Technology (NIT) Nagaland',
        },
      });

      if (res.success) {
        setTwoFactorVisible(false);
        router.replace('/(tabs)');
      } else {
        setTwoFactorError(res.message || 'Invalid or expired code. Please try again.');
      }
    } catch (e: any) {
      setTwoFactorError(e?.message || 'Verification failed.');
    } finally {
      setTwoFactorVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    const otpRes = await sendRegistrationOtp({
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
      role: role.toUpperCase(),
      department,
      currentYear: year,
      university: 'National Institute of Technology (NIT) Nagaland',
    });
    setLoading(false);
    if (otpRes.success) {
      setTwoFactorDevCode(otpRes.data?.devCode || null);
      setResendTimer(60);
      Alert.alert('Code Sent', 'A fresh verification code has been dispatched to your email.');
    } else {
      Alert.alert('Resend Failed', otpRes.message || 'Unable to resend code.');
    }
  };

  const handleGoogleSubmit = async () => {
    const clean = googleEmail.trim().toLowerCase();
    if (!clean) {
      Alert.alert('Email Required', 'Please enter your Google account email.');
      return;
    }
    setGoogleLoading(true);
    const success = await loginWithGoogle({
      email: clean,
      fullName: (googleFullName.trim() || fullName.trim()) || undefined,
    });
    setGoogleLoading(false);
    if (success) {
      setGoogleModalVisible(false);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', 'Unable to authenticate with Google. Please try again.');
    }
  };

  const handleLookupGitHub = async () => {
    const clean = githubUsername.trim().replace(/^@/, '');
    if (!clean) return;
    setGithubChecking(true);
    setGithubError(null);
    try {
      const res = await MobileApi.previewGitHubUser(clean);
      if (res.success && res.data) {
        setGithubProfile(res.data);
      } else {
        setGithubProfile(null);
        setGithubError(res.message || `GitHub user "@${clean}" not found.`);
      }
    } catch (e: any) {
      setGithubProfile(null);
      setGithubError(e?.message || 'Could not verify GitHub username.');
    } finally {
      setGithubChecking(false);
    }
  };

  const handleGitHubSubmit = async () => {
    const clean = githubUsername.trim().replace(/^@/, '');
    if (!clean) {
      Alert.alert('Username Required', 'Please enter your GitHub username.');
      return;
    }
    setGithubSigningIn(true);
    const res = await loginWithGitHub({
      username: clean,
      email: (githubEmail.trim() || email.trim()) || undefined,
    });
    setGithubSigningIn(false);
    if (res.success) {
      setGithubModalVisible(false);
      router.replace('/(tabs)');
    } else {
      setGithubError(res.error || 'GitHub registration failed.');
    }
  };

  const handleGoogleOAuth = () => {
    const googleAuthUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=647527528972-e6hov032q5igkbfdu3af9vmpdq3t53ag.apps.googleusercontent.com&redirect_uri=https://skillbridge-backend-15a7.onrender.com/api/v1/auth/google/callback&response_type=code&scope=openid%20email%20profile&prompt=select_account';
    Linking.openURL(googleAuthUrl).catch((err) => {
      Alert.alert('Browser Error', 'Could not open Google Accounts authorization: ' + err.message);
    });
  };

  const handleGithubOAuth = () => {
    const githubAuthUrl = 'https://skillbridge-backend-15a7.onrender.com/api/v1/auth/github';
    Linking.openURL(githubAuthUrl).catch((err) => {
      Alert.alert('Browser Error', 'Could not open GitHub authorization: ' + err.message);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Join StudyBridge</Text>
        <Text style={styles.subtitle}>
          Create your university networking & mentorship profile
        </Text>

        {/* Real Social Sign-Up Options */}
        <View style={styles.socialBox}>
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => setGoogleModalVisible(true)}
          >
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => setGithubModalVisible(true)}
            >
              <Text style={styles.socialBtnText}>GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => router.push('/(auth)/linkedin-import' as any)}
            >
              <Text style={styles.socialBtnText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR REGISTER WITH CAMPUS EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User size={16} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Rohit Gupta"
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

          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
            <Text style={styles.submitBtnText}>
              {loading ? 'Creating Account...' : 'Create Campus Account'}
            </Text>
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

      {/* Two-Factor Email Verification Modal */}
      <Modal
        visible={twoFactorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTwoFactorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setTwoFactorVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Two-Factor Verification</Text>
            <Text style={styles.modalSubtitle}>
              Enter 6-digit security code sent to 

              <Text style={{ fontWeight: '700', color: '#7c3aed' }}>{email.trim().toLowerCase()}</Text>
            </Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>6-Digit Security Code</Text>
              <TextInput
                style={[styles.modalInput, { textAlign: 'center', letterSpacing: 8, fontSize: 20, fontWeight: '700', fontFamily: 'monospace' }]}
                placeholder="••••••"
                value={twoFactorCode}
                onChangeText={(val) => {
                  setTwoFactorCode(val.replace(/[^0-9]/g, ''));
                  setTwoFactorError(null);
                }}
                keyboardType="numeric"
                maxLength={6}
                autoFocus
              />
            </View>

            {twoFactorError && (
              <View style={styles.modalErrorBox}>
                <Text style={styles.modalErrorText}>{twoFactorError}</Text>
              </View>
            )}

            {twoFactorDevCode && (
              <TouchableOpacity
                onPress={() => setTwoFactorCode(twoFactorDevCode)}
                style={[styles.modalProfileCard, { backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, color: '#6d28d9', fontWeight: '700' }}>
                    Verification Code: <Text style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 2 }}>{twoFactorDevCode}</Text>
                  </Text>
                  <Text style={{ fontSize: 10, color: '#7c3aed', textDecorationLine: 'underline', marginTop: 2 }}>
                    Tap to auto-fill code
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalPrimaryBtn, { backgroundColor: '#7c3aed' }]}
              onPress={handleVerify2FA}
              disabled={twoFactorVerifying || twoFactorCode.length !== 6}
            >
              {twoFactorVerifying ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalPrimaryBtnText}>Verify & Complete Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={handleResendOtp}
              disabled={resendTimer > 0}
            >
              <Text style={styles.modalSecondaryBtnText}>
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Verification Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Google Instant Registration Modal */}
      <Modal
        visible={googleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGoogleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setGoogleModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Register with Google</Text>
            <Text style={styles.modalSubtitle}>Instant verified campus membership</Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Google Email Address</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. name@gmail.com"
                value={googleEmail}
                onChangeText={setGoogleEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Full Name (optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Rohit Gupta"
                value={googleFullName}
                onChangeText={setGoogleFullName}
              />
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={handleGoogleSubmit}
              disabled={googleLoading || !googleEmail.trim()}
            >
              {googleLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalPrimaryBtnText}>Register with Google</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              onPress={() => {
                setGoogleModalVisible(false);
                handleGoogleOAuth();
              }}
            >
              <Text style={styles.modalSecondaryBtnText}>Open Browser OAuth Instead</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* GitHub Instant Registration Modal */}
      <Modal
        visible={githubModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setGithubModalVisible(false);
          setGithubProfile(null);
          setGithubError(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => {
                setGithubModalVisible(false);
                setGithubProfile(null);
                setGithubError(null);
              }}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Register with GitHub</Text>
            <Text style={styles.modalSubtitle}>Verify your live GitHub profile & repos</Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>GitHub Username</Text>
              <View style={styles.modalLookupRow}>
                <TextInput
                  style={[styles.modalInput, { flex: 1 }]}
                  placeholder="e.g. rohitgupta152311-rgb"
                  value={githubUsername}
                  onChangeText={(val) => {
                    setGithubUsername(val);
                    setGithubError(null);
                  }}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.modalLookupBtn}
                  onPress={handleLookupGitHub}
                  disabled={githubChecking || !githubUsername.trim()}
                >
                  <Text style={styles.modalLookupBtnText}>
                    {githubChecking ? '...' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {githubError && (
              <View style={styles.modalErrorBox}>
                <Text style={styles.modalErrorText}>{githubError}</Text>
              </View>
            )}

            {githubProfile && (
              <View style={styles.modalProfileCard}>
                {githubProfile.avatarUrl && (
                  <Image
                    source={{ uri: githubProfile.avatarUrl }}
                    style={styles.modalAvatar}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalProfileName}>{githubProfile.name || githubProfile.login}</Text>
                  <Text style={styles.modalProfileLogin}>@{githubProfile.login}</Text>
                  {githubProfile.bio && (
                    <Text style={styles.modalProfileBio} numberOfLines={2}>{githubProfile.bio}</Text>
                  )}
                  <Text style={styles.modalProfileStats}>
                    {githubProfile.publicRepos || 0} Repos • {githubProfile.followers || 0} Followers
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Campus Email (optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. student@nitnagaland.ac.in"
                value={githubEmail}
                onChangeText={setGithubEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.modalPrimaryBtn, { backgroundColor: '#0f172a' }]}
              onPress={handleGitHubSubmit}
              disabled={githubSigningIn || !githubUsername.trim()}
            >
              {githubSigningIn ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalPrimaryBtnText}>
                  {githubProfile ? `Register as @${githubProfile.login}` : 'Register with GitHub'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  socialBox: {
    gap: 10,
    marginBottom: 16,
  },
  googleBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  googleBtnText: {
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
    backgroundColor: '#f8fafc',
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalCloseText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 16,
  },
  modalInputGroup: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  modalLookupRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  modalLookupBtn: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalLookupBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalErrorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  modalErrorText: {
    color: '#dc2626',
    fontSize: 11,
    fontWeight: '600',
  },
  modalProfileCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  modalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#cbd5e1',
  },
  modalProfileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalProfileLogin: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  modalProfileBio: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  },
  modalProfileStats: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 3,
  },
  modalPrimaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  modalPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  modalSecondaryBtnText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
});