import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Zap,
  Globe,
  Bell,
  Video,
} from 'lucide-react';
import { Button } from './index';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'expo' | 'apk'>('pwa');

  if (!isOpen) return null;

  const apkUrl = '/downloads/skillbridge-campus-v3.0.0.apk';
  const webAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://skillbridge-frontend-yezp.onrender.com';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(webAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'skillbridge-campus-v3.0.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white font-heading">
                  SkillBridge Mobile App
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  v3.0.0
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Peer tutoring, real-time messaging, and live video sessions anywhere
              </p>
            </div>
          </div>

          {/* Quick Feature Pills */}
          <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <Zap className="w-3 h-3 text-amber-400" /> Instant Chat
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <Video className="w-3 h-3 text-sky-400" /> 1-on-1 Video
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <Bell className="w-3 h-3 text-emerald-400" /> Push Alerts
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Instant App (Home Screen)</span>
          </button>
          <button
            onClick={() => setActiveTab('expo')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'expo'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Expo Go (Native Phone)</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'apk'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cloud APK (EAS)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Download className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Direct Android Package (.APK)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Install directly on any Android device running Android 8.0 (Oreo) or later. No Google account required.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium pt-1">
                    <span>Package: com.studybridge.campus</span>
                    <span>&bull;</span>
                    <span>Size: ~38 MB</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold text-sm py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                  onClick={handleDownloadApk}
                >
                  {downloadStarted ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Download Started...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download APK Now (v3.0.0)</span>
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  SHA-256 verified build &bull; Safe for campus installation
                </p>
              </div>

              {/* Quick Installation Steps */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  How to install on your Android device:
                </h4>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Tap <strong>Download APK</strong> above from your phone or transfer it via USB.</li>
                  <li>When prompted, allow <em>&quot;Install from unknown sources&quot;</em> in your browser settings.</li>
                  <li>Open the downloaded file and tap <strong>Install</strong>.</li>
                  <li>Sign in with your campus student credentials and start chatting!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'expo' && (
            <div className="space-y-4">
              <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shadow-inner">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Run Natively with Expo Go</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Test the real native React Native mobile app on your Android phone or iPhone with 100% native gestures, camera, and real-time Socket.IO chat.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-2 text-xs">
                  <p className="font-bold text-slate-800">Quick 2-Step Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Install the free <strong>Expo Go</strong> app from Google Play Store or Apple App Store.</li>
                    <li>In the project terminal, run: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px]">cd mobile; npx expo start --tunnel</code></li>
                    <li>Scan the QR code in your terminal with Expo Go to launch immediately!</li>
                  </ol>
                </div>

                <div className="pt-1">
                  <Button
                    size="md"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
                    onClick={() => setActiveTab('pwa')}
                  >
                    <span>Or Use Instant Home Screen App &rarr;</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Add to Home Screen (Progressive Web App)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Run SkillBridge like a native app on iOS iPhone/iPad or Android without downloading any file.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🍎 Apple iOS (Safari)</span>
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Tap the <strong>Share</strong> button (box with arrow) at the bottom, then choose <strong>&quot;Add to Home Screen&quot;</strong>.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🤖 Android (Chrome)</span>
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Tap the <strong>three dots (⋮)</strong> in the top right, then select <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share / Copy App Link */}
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={webAppUrl}
                  className="flex-1 text-xs text-slate-600 bg-transparent outline-hidden font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="text-xs shrink-0 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Built with React Native &amp; Socket.IO</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
