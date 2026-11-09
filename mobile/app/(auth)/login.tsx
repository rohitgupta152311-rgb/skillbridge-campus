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
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { useAuth } from '../../services/auth-context';
import { MobileApi } from '../../services/api';

export default function MobileLoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithGitHub } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Instant Sign-In Modal
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleFullName, setGoogleFullName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // GitHub Instant Sign-In Modal
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
    const success = await login(cleanEmail, password);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert(
        'Sign In Failed',
        'Unable to sign in. Please verify your credentials or ensure your account has been approved by campus administration.'
      );
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
      fullName: googleFullName.trim() || undefined,
    });
    setGoogleLoading(false);
    if (success) {
      setGoogleModalVisible(false);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Sign-In Failed', 'Unable to authenticate with Google. Please try again.');
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
      email: githubEmail.trim() || undefined,
    });
    setGithubSigningIn(false);
    if (res.success) {
      setGithubModalVisible(false);
      router.replace('/(tabs)');
    } else {
      setGithubError(res.error || 'GitHub sign-in failed.');
    }
  };

  const handleLinkedInOIDC = () => {
    router.push('/(auth)/linkedin-import' as any);
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

        {/* Real OAuth Logins */}
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
              onPress={() => setGoogleModalVisible(true)}
            >
              <Text style={styles.socialBtnText}>Google SSO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => setGithubModalVisible(true)}
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
              {loading ? 'Authenticating...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Switch to Register */}
        <View style={styles.switchAuth}>
          <Text style={styles.switchText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.switchHighlight}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Fast-Fill Account Buttons */}
        <View style={styles.fastFillBox}>
          <Text style={styles.fastFillTitle}>INSTITUTIONAL EVALUATION ACCOUNTS</Text>

          <View style={styles.fastFillGrid}>
            <TouchableOpacity
              style={[styles.fastFillCard, { backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }]}
              onPress={() => {
                setEmail('admin@campus.edu');
                setPassword('admin1234');
              }}
            >
              <View style={styles.fastFillHeader}>
                <Text style={styles.fastFillName}>Admin</Text>
                <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>ADMIN</Text></View>
              </View>
              <Text style={styles.fastFillEmail}>admin@campus.edu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fastFillCard}
              onPress={() => {
                setEmail('rohit.gupta@campus.edu');
                setPassword('demo1234');
              }}
            >
              <View style={styles.fastFillHeader}>
                <Text style={styles.fastFillName}>Rohit Gupta</Text>
                <View style={styles.mentorBadge}><Text style={styles.mentorBadgeText}>STUDENT</Text></View>
              </View>
              <Text style={styles.fastFillEmail}>rohit.gupta@campus.edu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fastFillCard}
              onPress={() => {
                setEmail('vidya.gupta@campus.edu');
                setPassword('demo1234');
              }}
            >
              <View style={styles.fastFillHeader}>
                <Text style={styles.fastFillName}>Vidya Gupta</Text>
                <View style={styles.mentorBadge}><Text style={styles.mentorBadgeText}>MENTOR</Text></View>
              </View>
              <Text style={styles.fastFillEmail}>vidya.gupta@campus.edu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fastFillCard}
              onPress={() => {
                setEmail('nyoimei.konyak@campus.edu');
                setPassword('demo1234');
              }}
            >
              <View style={styles.fastFillHeader}>
                <Text style={styles.fastFillName}>Nyoimel C Konyak</Text>
                <View style={styles.mentorBadge}><Text style={styles.mentorBadgeText}>MENTOR</Text></View>
              </View>
              <Text style={styles.fastFillEmail}>nyoimei.konyak@campus.edu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Google Instant Sign-In Modal */}
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

            <Text style={styles.modalTitle}>Sign in with Google</Text>
            <Text style={styles.modalSubtitle}>Verified Google SSO Authentication</Text>

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
                <Text style={styles.modalPrimaryBtnText}>Continue with Google</Text>
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

      {/* GitHub Instant Sign-In Modal */}
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

            <Text style={styles.modalTitle}>Sign in with GitHub</Text>
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
                  {githubProfile ? `Sign in as @${githubProfile.login}` : 'Sign in with GitHub'}
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
  fastFillBox: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  fastFillTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  fastFillGrid: {
    gap: 8,
  },
  fastFillCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fastFillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  fastFillName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  adminBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adminBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7c3aed',
  },
  mentorBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  mentorBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
  },
  fastFillEmail: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'monospace',
  },
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
    flexDirection: 'row',
    justifyContent: 'center',
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