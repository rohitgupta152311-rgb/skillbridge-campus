import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Smartphone,
  Download,
  ShieldCheck,
  Zap,
  Video,
  Bell,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Users,
  Repeat,
} from 'lucide-react';
import { Button } from '../../shared/components';

export function DownloadAppPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

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
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-white group">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">SkillBridge</span>
              <span className="text-[10px] text-violet-400 font-semibold block -mt-1">Mobile Edition</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/feed"
              className="text-xs text-slate-400 hover:text-white font-semibold transition-colors hidden sm:block"
            >
              Open Web App
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero & Download Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-20 flex-1 w-full space-y-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Android Release &bull; Version 3.0.0</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              SkillBridge Campus in Your Pocket
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Take peer tutoring everywhere. Connect with campus peers, receive instant real-time message alerts via Socket.IO, and join 1-on-1 video tutoring sessions straight from your Android device.
            </p>

            {/* Download & Launch CTA Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/feed"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Install App on Phone (PWA)</span>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-xs py-4 rounded-2xl flex items-center justify-center gap-1.5"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Share Mobile Link</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Instant 0-Second Installation (Recommended)
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Open this link in Chrome on Android &rarr; tap the three dots (&vellip;) &rarr; tap <strong>&quot;Install App&quot;</strong> (or &quot;Add to Home Screen&quot;). It installs directly without any APK download warnings, runs full-screen, and connects to live PostgreSQL!
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Expo Native Code: Run via Expo Go or EAS Cloud Build</span>
                </div>
                <span>React Native 0.76 &bull; Expo SDK 52</span>
              </div>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-bold text-slate-200">Real-Time Chat</p>
                <p className="text-[10px] text-slate-500">Live Socket.IO messaging</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1">
                <Video className="w-4 h-4 text-sky-400" />
                <p className="text-xs font-bold text-slate-200">1-on-1 Video</p>
                <p className="text-[10px] text-slate-500">WebRTC tutoring rooms</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-1">
                <Repeat className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-bold text-slate-200">Skill Exchange</p>
                <p className="text-[10px] text-slate-500">Reciprocal barter matching</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup / Phone Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 rounded-[40px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl shadow-indigo-950/50">
              {/* Speaker Notch */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
              </div>

              {/* Phone Inner Screen */}
              <div className="rounded-[30px] overflow-hidden bg-slate-950 p-4 space-y-4 border border-slate-800 text-left">
                {/* Mock Phone Status Header */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-900">
                  <span className="font-semibold text-white">SkillBridge Mobile</span>
                  <span className="text-emerald-400 font-bold">&bull; Live WSS</span>
                </div>

                {/* Mock Incoming Chat */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                      VG
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">Vidya Gupta</p>
                      <p className="text-[9px] text-slate-400">NIT Nagaland &bull; Online</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    &quot;Hey! I can teach Power Electronics today at 4 PM in exchange for React guidance.&quot;
                  </p>
                </div>

                {/* Mock Tutoring Room */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase">Live Tutoring Session</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <p className="text-xs font-bold text-white">Microcontroller &amp; 8051 Lab</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center gap-1">
                      <Video className="w-3 h-3" /> Join Room
                    </button>
                  </div>
                </div>

                {/* Direct Download in Mockup */}
                <button
                  onClick={handleDownloadApk}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tap to Install APK</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <section className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white">3 Simple Steps to Install the App</h2>
            <p className="text-xs text-slate-400">Works with all Android phones and tablets running Android 8 or newer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-200">Download the File</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click <strong>Download Android APK</strong> above to download the installer directly to your device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-200">Allow Installation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If prompted, tap Settings and toggle <em>&quot;Allow from this source&quot;</em> to permit installing the campus package.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-200">Sign In &amp; Learn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open SkillBridge and sign in with your student email to start swapping skills with peers immediately.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 SkillBridge Campus Network. Android Application Package (CIH-008).</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-300">Home</Link>
            <Link to="/explore" className="hover:text-slate-300">Peer Directory</Link>
            <Link to="/login" className="hover:text-slate-300">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
