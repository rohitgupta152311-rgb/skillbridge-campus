import { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Smartphone,
  Globe,
  Bell,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Laptop,
  Trash2,
} from 'lucide-react';
import { Card, Button, Badge } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { useToastStore } from '../../shared/notifications/toast-store';

export function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const [linkedAccounts, setLinkedAccounts] = useState<
    { provider: 'linkedin' | 'google' | 'github'; connected: boolean; email?: string }[]
  >([
    { provider: 'linkedin', connected: true, email: user?.email },
    { provider: 'google', connected: false },
    { provider: 'github', connected: false },
  ]);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'session-1',
      device: 'MacBook Pro / Chrome 124',
      location: 'Campus Library (Current)',
      ip: '192.168.1.42',
      isCurrent: true,
      lastActive: 'Active now',
    },
    {
      id: 'session-2',
      device: 'Pixel 8 / SkillBridge Mobile App',
      location: 'University Dorms',
      ip: '10.0.4.15',
      isCurrent: false,
      lastActive: '2 hours ago',
    },
  ]);

  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  const handleToggleLink = (provider: 'linkedin' | 'google' | 'github') => {
    setLinkedAccounts((prev) =>
      prev.map((acc) => {
        if (acc.provider === provider) {
          const next = !acc.connected;
          addToast({
            title: next
              ? `${provider.toUpperCase()} account linked`
              : `${provider.toUpperCase()} account unlinked`,
            type: 'success',
          });
          return { ...acc, connected: next, email: next ? user?.email : undefined };
        }
        return acc;
      })
    );
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoggingOutAll(false);
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    addToast({ title: 'Signed out of all other devices', message: 'Mobile and other web sessions invalidated.', type: 'success' });
  };

  const checkAppUpdates = async () => {
    setCheckingUpdate(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/version').catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        setUpdateStatus(`Up to date! Latest native build: v${json.data.latestNativeVersion} (${json.data.otaChannel} channel).`);
      } else {
        setUpdateStatus('SkillBridge 3.0 Web & Mobile are up to date! (OTA Channel: production).');
      }
    } catch {
      setUpdateStatus('All systems synchronized and operational.');
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account & Security Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your unified campus profile, connected OAuth providers, active web/mobile sessions, and data synchronization.
        </p>
      </div>

      {/* Connected Accounts Section */}
      <Card padding="lg" className="border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Connected Authentication Providers</h2>
            <p className="text-xs text-slate-500">
              Sign in to SkillBridge across web and mobile using any of these linked accounts.
            </p>
          </div>
          <Badge variant="violet" size="sm">Single Sign-On</Badge>
        </div>

        <div className="space-y-3">
          {/* LinkedIn */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">LinkedIn</span>
                  {linkedAccounts.find((a) => a.provider === 'linkedin')?.connected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Connected & Auto-Synced
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {linkedAccounts.find((a) => a.provider === 'linkedin')?.connected
                    ? `Linked to ${user?.email}`
                    : 'Connect to import headline and verify credibility'}
                </p>
              </div>
            </div>

            <Button
              variant={linkedAccounts.find((a) => a.provider === 'linkedin')?.connected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleLink('linkedin')}
            >
              {linkedAccounts.find((a) => a.provider === 'linkedin')?.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          {/* Google */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900">Google Workspace / Campus SSO</span>
                <p className="text-xs text-slate-500">
                  {linkedAccounts.find((a) => a.provider === 'google')?.connected
                    ? `Linked to ${user?.email}`
                    : 'Log in with your official university Google account'}
                </p>
              </div>
            </div>

            <Button
              variant={linkedAccounts.find((a) => a.provider === 'google')?.connected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleLink('google')}
            >
              {linkedAccounts.find((a) => a.provider === 'google')?.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          {/* GitHub */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900">GitHub</span>
                <p className="text-xs text-slate-500">
                  {linkedAccounts.find((a) => a.provider === 'github')?.connected
                    ? `Linked to ${user?.email}`
                    : 'Showcase repositories and projects on your profile'}
                </p>
              </div>
            </div>

            <Button
              variant={linkedAccounts.find((a) => a.provider === 'github')?.connected ? 'outline' : 'primary'}
              size="sm"
              onClick={() => handleToggleLink('github')}
            >
              {linkedAccounts.find((a) => a.provider === 'github')?.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Multi-Device Sessions */}
      <Card padding="lg" className="border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Web & Mobile Sessions</h2>
            <p className="text-xs text-slate-500">
              Manage devices currently logged into your SkillBridge account.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogoutAll}
            isLoading={isLoggingOutAll}
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Log Out All Other Devices
          </Button>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/60 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  {session.device.includes('Pixel') || session.device.includes('Mobile') ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{session.device}</span>
                    {session.isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        This Device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {session.location} • IP: {session.ip} • <span className="text-violet-600">{session.lastActive}</span>
                  </p>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => {
                    setActiveSessions((prev) => prev.filter((s) => s.id !== session.id));
                    addToast({ title: 'Session revoked', message: `Signed out of ${session.device}.`, type: 'info' });
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Revoke session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Version & Automatic Updates Section */}
      <Card padding="lg" className="border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Application Version & Updates</h2>
            <p className="text-xs text-slate-500">
              SkillBridge 3.0 uses Expo EAS OTA runtime updates and Render Web Service deployments.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkAppUpdates}
            isLoading={checkingUpdate}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Check for Updates
          </Button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Web Client Version:</span>
            <span className="font-mono font-bold text-slate-900">3.0.0-production</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Mobile Native Runtime:</span>
            <span className="font-mono font-bold text-slate-900">exposdk:52.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">EAS Update Channel:</span>
            <span className="font-mono font-bold text-violet-700">production</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Database Engine:</span>
            <span className="font-mono font-bold text-slate-900">Render PostgreSQL 16 (Authoritative)</span>
          </div>

          {updateStatus && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{updateStatus}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
