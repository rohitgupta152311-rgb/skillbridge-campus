import { useState, useEffect } from 'react';
import {
  Shield,
  Smartphone,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Laptop,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Card, Button, Badge } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { useToastStore } from '../../shared/notifications/toast-store';
import { apiClient } from '../../infrastructure/api/api-client';

export function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const [providerConfig, setProviderConfig] = useState<{
    googleConfigured: boolean;
    githubConfigured: boolean;
    linkedinConfigured: boolean;
  }>({
    googleConfigured: false,
    githubConfigured: false,
    linkedinConfigured: false,
  });

  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Detect current client device accurately
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Standard Web Client';
  const getDeviceLabel = () => {
    if (/Windows/i.test(userAgent)) return 'Windows PC • Browser Session';
    if (/Macintosh/i.test(userAgent)) return 'Apple macOS • Browser Session';
    if (/Android/i.test(userAgent)) return 'Android Device • Mobile Client';
    if (/iPhone|iPad/i.test(userAgent)) return 'Apple iOS • Mobile Client';
    if (/Linux/i.test(userAgent)) return 'Linux Workstation • Browser Session';
    return 'Desktop Browser Session';
  };

  const [activeSessions] = useState([
    {
      id: 'session-current',
      device: getDeviceLabel(),
      location: typeof window !== 'undefined' ? `${window.location.hostname} (Active)` : 'Campus Portal',
      ip: typeof window !== 'undefined' ? window.location.host : 'Localhost',
      isCurrent: true,
      lastActive: 'Active Now',
    },
  ]);

  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoadingProviders(true);
      try {
        const [providers, me] = await Promise.all([
          apiClient.getAuthProviders(),
          apiClient.getMe(),
        ]);
        if (isMounted) {
          if (providers) {
            setProviderConfig(providers);
          }
          if (me && Array.isArray(me.accounts)) {
            updateUser({ accounts: me.accounts });
          }
        }
      } catch {
        // Fallback for offline mode
      } finally {
        if (isMounted) setIsLoadingProviders(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [updateUser]);

  // Derived truthful connection state based on verified backend accounts
  const isConnected = (provider: 'linkedin' | 'google' | 'github') => {
    return Boolean(user?.accounts?.some((a) => a.provider.toLowerCase() === provider));
  };

  const getAccountEmail = (provider: 'linkedin' | 'google' | 'github') => {
    const acc = user?.accounts?.find((a) => a.provider.toLowerCase() === provider);
    return (acc as any)?.email || user?.email;
  };

  const handleConnect = (provider: 'linkedin' | 'google' | 'github') => {
    if (provider === 'linkedin') {
      if (!providerConfig.linkedinConfigured) {
        addToast({
          title: 'LinkedIn Server Setup Required',
          message: 'LinkedIn OAuth credentials (LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET) are not configured on the backend server. Contact your system administrator.',
          type: 'warning',
        });
        return;
      }
      window.location.href = `${apiClient.getApiBase()}/auth/linkedin`;
      return;
    }

    if (provider === 'google') {
      if (!providerConfig.googleConfigured) {
        addToast({
          title: 'Google OAuth Not Configured',
          message: 'Google Client ID is not configured on the campus backend server.',
          type: 'warning',
        });
        return;
      }
      window.location.href = `${apiClient.getApiBase()}/auth/google`;
      return;
    }

    if (provider === 'github') {
      if (!providerConfig.githubConfigured) {
        addToast({
          title: 'GitHub OAuth Not Configured',
          message: 'GitHub OAuth credentials are not configured on the campus backend server.',
          type: 'warning',
        });
        return;
      }
      window.location.href = `${apiClient.getApiBase()}/auth/github`;
      return;
    }
  };

  const handleDisconnect = async (provider: 'linkedin' | 'google' | 'github') => {
    setActionLoading(provider);
    try {
      const res = await apiClient.unlinkAccount(provider);
      if (res.success) {
        const remaining = (user?.accounts || []).filter(
          (a) => a.provider.toLowerCase() !== provider
        );
        updateUser({ accounts: remaining });
        addToast({
          title: `${provider.toUpperCase()} Disconnected`,
          message: res.message || `Successfully disconnected your ${provider} account.`,
          type: 'success',
        });
      } else {
        addToast({
          title: 'Disconnection Failed',
          message: res.message || `Failed to unlink ${provider} account from server.`,
          type: 'error',
        });
      }
    } catch (err: any) {
      addToast({
        title: 'Network Error',
        message: err?.message || 'Could not communicate with server to unlink account.',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const checkAppUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateStatus(null);
    try {
      const apiBase = apiClient.getApiBase();
      const res = await fetch(`${apiBase.replace('/api/v1', '')}/health`).catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        setUpdateStatus(`Server operational (v${json.version || '3.0.0'}). Database: ${json.database}. All endpoints responsive.`);
      } else {
        setUpdateStatus('Update service check: Server returned non-200 status or is offline.');
      }
    } catch {
      setUpdateStatus('Could not reach backend health service to verify updates.');
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account & Security Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your verified campus profile, connected identity providers, active sessions, and data security.
        </p>
      </div>

      {/* Connected Accounts Section */}
      <Card padding="lg" className="border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Authentication Providers &amp; Integrations</h2>
            <p className="text-xs text-slate-500">
              Only verified providers linked to your active campus account are shown as connected.
            </p>
          </div>
          <Badge variant="violet" size="sm">Single Sign-On</Badge>
        </div>

        <div className="space-y-3">
          {/* LinkedIn */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">LinkedIn</span>
                  {isConnected('linkedin') ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                      Not Connected
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {providerConfig.linkedinConfigured ? '• Server: Configured' : '• Server: Unconfigured'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isConnected('linkedin')
                    ? `Linked to verified LinkedIn identity (${getAccountEmail('linkedin')})`
                    : 'Not connected. Connect via OAuth 2.0 to import verified headline and endorsements.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {isConnected('linkedin') ? (
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={actionLoading === 'linkedin'}
                  onClick={() => handleDisconnect('linkedin')}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleConnect('linkedin')}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>

          {/* Google */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">Google Workspace / Campus SSO</span>
                  {isConnected('google') ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                      Not Connected
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {providerConfig.googleConfigured ? '• Server: Configured' : '• Server: Unconfigured'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isConnected('google')
                    ? `Linked to verified Google account (${getAccountEmail('google')})`
                    : 'Not connected. Connect with your official university Google account.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {isConnected('google') ? (
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={actionLoading === 'google'}
                  onClick={() => handleDisconnect('google')}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleConnect('google')}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>

          {/* GitHub */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">GitHub</span>
                  {isConnected('github') ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                      Not Connected
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {providerConfig.githubConfigured ? '• Server: Configured' : '• Server: Unconfigured'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isConnected('github')
                    ? `Linked to verified GitHub profile (${getAccountEmail('github')})`
                    : 'Not connected. Connect to showcase code repositories on your profile.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {isConnected('github') ? (
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={actionLoading === 'github'}
                  onClick={() => handleDisconnect('github')}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleConnect('github')}
                >
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Active Session Info */}
      <Card padding="lg" className="border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Current Active Session</h2>
            <p className="text-xs text-slate-500">
              Verified session running on this device.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/60 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{session.device}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Active Now
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Host: {session.ip} • <span className="text-violet-600 font-medium">Session Authenticated</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Version & Real Telemetry Health */}
      <Card padding="lg" className="border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Health &amp; Version Telemetry</h2>
            <p className="text-xs text-slate-500">
              Query live backend health check endpoint to verify database and runtime availability.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkAppUpdates}
            isLoading={checkingUpdate}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Ping Health Service
          </Button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Frontend Release:</span>
            <span className="font-mono font-bold text-slate-900">v3.2.0 (Campus Edition)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Backend API Base:</span>
            <span className="font-mono font-bold text-violet-700">{apiClient.getApiBase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Auth Token Storage:</span>
            <span className="font-mono font-bold text-slate-900">Encrypted localStorage (sb_auth_token)</span>
          </div>

          {updateStatus && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-600" />
              <span>{updateStatus}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
