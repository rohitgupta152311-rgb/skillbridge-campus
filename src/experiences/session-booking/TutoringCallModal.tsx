import { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  FileText,
  Settings,
  Sparkles,
  Maximize2,
  Volume2,
  Send,
  Download,
  Users,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Avatar, Badge, Button, Modal } from '../../shared/components';
import { formatTime } from '../../foundation/helpers';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { useToastStore } from '../../shared/notifications/toast-store';

export interface TutoringCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: {
    id: string;
    fullName: string;
    avatar?: string;
    department?: string;
    role?: string;
    university?: string;
  };
  topic: string;
  initialMode?: 'video' | 'voice';
  sessionId?: string;
  onCompleteSession?: (sessionId: string) => void;
}

export function TutoringCallModal({
  isOpen,
  onClose,
  partner,
  topic,
  initialMode = 'video',
  sessionId,
  onCompleteSession,
}: TutoringCallModalProps) {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [callMode, setCallMode] = useState<'video' | 'voice'>(initialMode);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(initialMode === 'video');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'notes' | null>(null);

  // Call timer
  const [callDuration, setCallDuration] = useState(0);

  // In-call chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: partner.fullName,
      text: `Hi ${typeof user?.fullName === 'string' && user.fullName.trim() ? user.fullName.trim().split(' ')[0] : 'there'}! Ready to begin our session on ${topic}.`,
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // In-call shared notes
  const [sharedNotes, setSharedNotes] = useState(
    `# ${topic} — Tutoring Session Notes\n\n- Date: ${new Date().toLocaleDateString()}\n- Mentor: ${partner.fullName}\n- Student: ${user?.fullName || 'Student'}\n\n### Key Discussion Points:\n1. Core theoretical foundations\n2. Practical implementation & problem-solving\n3. Q&A and next steps\n`
  );

  useEffect(() => {
    setCallMode(initialMode);
    setIsCameraOn(initialMode === 'video');
  }, [initialMode]);

  useEffect(() => {
    let timer: any = null;
    if (isOpen) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: user?.fullName || 'You',
        text: chatInput.trim(),
        time: 'Just now',
      },
    ]);
    setChatInput('');
  };

  const handleEndCall = () => {
    if (sessionId && onCompleteSession) {
      onCompleteSession(sessionId);
    }
    addToast({
      type: 'success',
      title: 'Tutoring Session Concluded',
      message: `Call lasted ${formatCallTime(callDuration)}. Great work!`,
    });
    onClose();
  };

  const handleExportNotes = () => {
    const blob = new Blob([sharedNotes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.replace(/\s+/g, '_')}_Tutoring_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'info', title: 'Notes Exported', message: 'Saved to your downloads.' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[92vh] max-h-[850px] flex flex-col overflow-hidden shadow-2xl animate-fade-in text-white relative">
        {/* ── TOP HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar name={partner.fullName} src={partner.avatar} size="md" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white truncate">{partner.fullName}</p>
                <Badge variant="violet" size="sm">
                  {partner.role === 'mentor' ? 'Campus Mentor' : 'Peer Student'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {topic} &bull; {partner.department || 'NIT Nagaland'}
              </p>
            </div>
          </div>

          {/* Mode Switcher & Timer */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-semibold">{formatCallTime(callDuration)}</span>
            </div>

            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setCallMode('video');
                  setIsCameraOn(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  callMode === 'video' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Video Call</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCallMode('voice');
                  setIsCameraOn(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  callMode === 'voice' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN STAGE + OPTIONAL SIDE DRAWER ── */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Main Call View */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
            {callMode === 'video' ? (
              /* ── VIDEO MODE ── */
              <div className="w-full h-full flex flex-col justify-center items-center relative">
                {isScreenSharing ? (
                  /* Screen Share Layout */
                  <div className="w-full h-full rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
                    <Monitor className="w-16 h-16 text-indigo-400 animate-pulse mb-3" />
                    <p className="text-base font-bold text-white">Presenting Active Screen</p>
                    <p className="text-xs text-slate-400 max-w-md mt-1">
                      Sharing project code, MATLAB schematic diagrams, and technical simulation workspace with {partner.fullName}.
                    </p>
                    <div className="absolute top-4 right-4 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE SCREENCAST
                    </div>
                  </div>
                ) : (
                  /* Remote Participant Video Canvas */
                  <div className="w-full h-full max-h-[500px] rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                    {/* Simulated High-Def Video Stream or Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <Avatar
                          name={partner.fullName}
                          src={partner.avatar}
                          size="xl"
                          className="!w-28 !h-28 !text-3xl ring-4 ring-violet-500/40 shadow-xl"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400">
                          <Mic className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white">{partner.fullName}</p>
                        <p className="text-xs text-slate-400">Speaking &bull; Audio Active</p>
                      </div>
                    </div>

                    {/* Partner Label */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{partner.fullName}</span>
                      <span className="text-[10px] text-slate-400">(Remote)</span>
                    </div>
                  </div>
                )}

                {/* Local Picture-in-Picture Feed */}
                <div className="absolute bottom-6 right-6 w-36 sm:w-48 h-28 sm:h-36 rounded-2xl bg-slate-800 border-2 border-slate-700/80 shadow-2xl overflow-hidden flex flex-col items-center justify-center z-10 group">
                  {isCameraOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex flex-col items-center justify-center p-2 relative">
                      <Avatar name={user?.fullName || 'You'} size="lg" />
                      <span className="text-[10px] font-semibold text-slate-300 mt-1 truncate">You (Camera On)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-2">
                      <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                      <span className="text-[10px]">Camera Off</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                    You
                  </div>
                </div>
              </div>
            ) : (
              /* ── VOICE CALL MODE ── */
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  {/* Glowing Pulse Rings */}
                  <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-2xl animate-ping" />
                  <div className="absolute -inset-4 rounded-full bg-indigo-500/10 blur-xl" />

                  <Avatar
                    name={partner.fullName}
                    src={partner.avatar}
                    size="xl"
                    className="!w-32 !h-32 !text-4xl ring-4 ring-violet-500 relative z-10 shadow-2xl"
                  />
                  <div className="absolute bottom-1 right-1 p-2 rounded-full bg-slate-900 border-2 border-slate-700 text-emerald-400 z-20 shadow-md">
                    <Mic className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1 relative z-10">
                  <h3 className="text-2xl font-bold text-white">{partner.fullName}</h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    High-Definition Voice Tutoring Channel &bull; Connected
                  </p>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1.5 h-10 px-6 py-2 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  {[24, 40, 16, 32, 48, 20, 36, 12, 44, 28, 16, 38, 22].map((height, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-violet-600 to-indigo-400 rounded-full animate-pulse"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-500 font-mono">
                  Audio Bitrate: 48kHz Stereo &bull; Low Latency (14ms)
                </p>
              </div>
            )}
          </div>

          {/* ── OPTIONAL SIDE PANEL (CHAT / SHARED NOTES) ── */}
          {activeSidePanel && (
            <div className="w-80 sm:w-96 border-l border-slate-800 bg-slate-900 flex flex-col z-20">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeSidePanel === 'chat' ? (
                    <>
                      <MessageSquare className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-bold text-white">In-Call Tutoring Chat</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-bold text-white">Session Collaborative Notes</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSidePanel(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close &times;
                </button>
              </div>

              {/* Drawer Body */}
              {activeSidePanel === 'chat' ? (
                <div className="flex-1 flex flex-col p-4 space-y-3 min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                    {chatMessages.map((msg, idx) => {
                      const isMe = msg.sender === (user?.fullName || 'You');
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                            isMe
                              ? 'ml-auto bg-violet-600 text-white rounded-br-xs'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                          }`}
                        >
                          <p className="font-semibold text-[10px] opacity-75 mb-0.5">{msg.sender}</p>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message or code snippet..."
                      className="flex-1 bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-violet-500 text-white placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-4 space-y-3 min-h-0">
                  <p className="text-[11px] text-slate-400">
                    Live editable markdown notes shared between you and {partner.fullName}:
                  </p>
                  <textarea
                    value={sharedNotes}
                    onChange={(e) => setSharedNotes(e.target.value)}
                    className="flex-1 w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                  />
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleExportNotes}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      className="text-xs border-slate-700 text-slate-200 hover:bg-slate-800"
                    >
                      Export Notes (.md)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── BOTTOM CONTROL BAR ── */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Session ID: <span className="font-mono text-slate-300">{sessionId || 'tutoring-live'}</span>
            </span>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-3">
            {/* Mic Toggle */}
            <button
              type="button"
              onClick={() => setIsMicOn((prev) => !prev)}
              className={`p-3 rounded-2xl transition-all shadow-md ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsCameraOn((prev) => !prev);
                if (callMode === 'voice') setCallMode('video');
              }}
              className={`p-3 rounded-2xl transition-all shadow-md ${
                isCameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              type="button"
              onClick={() => setIsScreenSharing((prev) => !prev)}
              className={`p-3 rounded-2xl transition-all shadow-md ${
                isScreenSharing
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Share Screen"
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* In-Call Chat Drawer Toggle */}
            <button
              type="button"
              onClick={() => setActiveSidePanel((prev) => (prev === 'chat' ? null : 'chat'))}
              className={`p-3 rounded-2xl transition-all shadow-md relative ${
                activeSidePanel === 'chat'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Open In-Call Chat"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-violet-400" />
            </button>

            {/* Notes Drawer Toggle */}
            <button
              type="button"
              onClick={() => setActiveSidePanel((prev) => (prev === 'notes' ? null : 'notes'))}
              className={`p-3 rounded-2xl transition-all shadow-md ${
                activeSidePanel === 'notes'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Shared Notes"
            >
              <FileText className="w-5 h-5" />
            </button>

            {/* End Call Button */}
            <button
              type="button"
              onClick={handleEndCall}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-red-600/30"
              title="End Tutoring Call"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">End Session</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              256-bit Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
