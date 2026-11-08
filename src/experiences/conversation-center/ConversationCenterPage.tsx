import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  ArrowRight,
  Search,
  Plus,
  Users,
  UserCheck,
  MessageSquare,
  Sparkles,
  X,
  ExternalLink,
  Video,
  PhoneCall,
  Flag,
  Shield,
} from 'lucide-react';
import { Avatar, Card, Badge, EmptyState, Button, Modal } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { apiClient } from '../../infrastructure/api/api-client';
import { socketClient } from '../../infrastructure/socket/socket-client';
import { TutoringCallModal } from '../session-booking/TutoringCallModal';
import {
  getUserById,
  getUsers,
  markMessagesRead,
  isUserConnected,
  sendConnectionRequest,
} from '../../infrastructure/local-storage/data-service';
import { formatRelativeTime } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import { User, Conversation, Message } from '../../foundation/types';
import clsx from 'clsx';

export function ConversationCenterPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  if (!user) return null;

  const handleStartChatWithPeer = async (peerIdOrEmail: string) => {
    try {
      const conv = await apiClient.startConversation(peerIdOrEmail);
      if (conv && conv.id) {
        setIsComposeOpen(false);
        navigate(`/messages/${conv.id}`);
        return;
      }
    } catch (err) {
      console.warn('API start conversation error:', err);
    }
    setIsComposeOpen(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-fade-in">
      {/* ── CONVERSATION SIDEBAR ── */}
      <ConversationList
        userId={user.id}
        activeId={conversationId}
        search={searchTerm}
        onSearch={setSearchTerm}
        onOpenCompose={() => setIsComposeOpen(true)}
        onStartChat={handleStartChatWithPeer}
        className={clsx(
          'w-full md:w-80 lg:w-96 border-r border-slate-200 flex-shrink-0 flex flex-col',
          conversationId && 'hidden md:flex'
        )}
      />

      {/* ── CHAT AREA OR CONNECTED PEERS PORTAL ── */}
      {conversationId ? (
        <ChatArea
          conversationId={conversationId}
          userId={user.id}
          onBack={() => navigate('/messages')}
        />
      ) : (
        <ConnectedPeersDashboard
          userId={user.id}
          onStartChat={handleStartChatWithPeer}
        />
      )}

      {/* ── COMPOSE MODAL (START CHAT WITH CONNECTED PEER) ── */}
      <ComposeChatModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        userId={user.id}
        onSelectPeer={handleStartChatWithPeer}
      />
    </div>
  );
}

// ─── CONVERSATION LIST (WITH CONNECTED PEERS QUICK-BAR) ──────
function ConversationList({
  userId,
  activeId,
  search,
  onSearch,
  onOpenCompose,
  onStartChat,
  className,
}: {
  userId: string;
  activeId?: string;
  search: string;
  onSearch: (s: string) => void;
  onOpenCompose: () => void;
  onStartChat: (peerId: string) => void;
  className?: string;
}) {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [livePeers, setLivePeers] = useState<any[]>([]);
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);

  const loadConversations = async () => {
    try {
      const apiConvs = await apiClient.getConversations();
      setConversations(apiConvs.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()));
    } catch (err) {
      console.warn('Could not load conversations:', err);
    } finally {
      setIsLoadingConvs(false);
    }
  };

  useEffect(() => {
    loadConversations();
    socketClient.connect();

    apiClient.getPeerSuggestions()
      .then((peers) => {
        if (peers && Array.isArray(peers)) {
          setLivePeers(peers.filter(p => p.id !== userId && p.role !== 'admin' && p.id !== 'user-admin' && p.fullName?.toLowerCase() !== 'admin'));
        }
      })
      .catch(() => {});

    const unsubscribeConv = socketClient.onConversationUpdated(({ conversationId, lastMessage }) => {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === conversationId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: lastMessage.content,
            lastMessageAt: lastMessage.createdAt || new Date().toISOString(),
          };
          return updated.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        } else {
          loadConversations();
          return prev;
        }
      });
    });

    const unsubscribeMsg = socketClient.onMessageReceived((msg) => {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === msg.conversationId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            lastMessage: msg.content,
            lastMessageAt: msg.createdAt || new Date().toISOString(),
          };
          return updated.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        } else {
          loadConversations();
          return prev;
        }
      });
    });

    return () => {
      unsubscribeConv();
      unsubscribeMsg();
    };
  }, [userId]);

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const rawOther = (c as any).otherUser;
    const name = rawOther?.profile?.fullName || (typeof rawOther?.email === 'string' ? rawOther.email : '') || getUserById(c.participantIds.find(p => p !== userId) || '')?.fullName || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={className}>
      {/* Header with Compose Button */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Messages</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {conversations.length}
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCompose}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-semibold py-1.5 px-2.5 rounded-xl border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 hover:text-violet-700"
          >
            Start Messaging
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all bg-slate-50/50"
            placeholder="Search conversations..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── LIVE PEERS QUICK TRAY ── */}
      {livePeers.length > 0 && !search && (
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-violet-600" />
              Campus Peers ({livePeers.length})
            </span>
            <Link
              to="/network"
              className="text-[10px] font-semibold text-violet-600 hover:underline"
            >
              Directory &rarr;
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {livePeers.slice(0, 10).map(peer => (
              <button
                key={peer.id}
                type="button"
                onClick={() => onStartChat(peer.id)}
                className="group flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-200/80 transition-all text-center flex-shrink-0 w-16"
                title={`Chat with ${peer.fullName}`}
              >
                <div className="relative">
                  <Avatar name={peer?.fullName || 'Peer'} src={peer?.avatar} size="md" showStatus status={peer?.onlineStatus} />
                </div>
                <span className="text-[10px] font-medium text-slate-700 truncate w-full group-hover:text-violet-700">
                  {(typeof peer?.fullName === 'string' && peer.fullName.trim() ? peer.fullName : 'Peer').split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CONVERSATIONS LIST ── */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Reach out to your classmates, mentors, and peers across campus to start chatting in real time.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenCompose}
              className="text-xs font-semibold"
            >
              Start First Chat
            </Button>
          </div>
        ) : (
          filtered.map(conv => {
            const otherId = conv.participantIds.find(p => p !== userId) || '';
            const rawOther = (conv as any).otherUser;
            const other = rawOther ? {
              id: rawOther.id,
              fullName: rawOther.profile?.fullName || (typeof rawOther.email === 'string' && rawOther.email.includes('@') ? rawOther.email.split('@')[0] : 'Campus Peer'),
              avatar: rawOther.profile?.avatarUrl || '',
              onlineStatus: rawOther.profile?.onlineStatus || 'available',
            } : getUserById(otherId) || {
              id: otherId,
              fullName: 'Campus Peer',
              avatar: '',
              onlineStatus: 'available' as const,
            };
            const unread = conv.unreadCount?.[userId] || 0;
            const isActive = conv.id === activeId;
            const isConnected = isUserConnected(userId, otherId);

            return (
              <button
                key={conv.id}
                onClick={() => navigate(`/messages/${conv.id}`)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  isActive
                    ? 'bg-violet-50/80 border-l-4 border-l-violet-600'
                    : 'hover:bg-slate-50'
                )}
              >
                <Avatar
                  name={other?.fullName || 'User'}
                  src={other?.avatar}
                  size="md"
                  showStatus
                  status={other?.onlineStatus}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className={clsx(
                          'text-sm truncate',
                          unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'
                        )}
                      >
                        {other?.fullName}
                      </span>
                      {isConnected && (
                        <span title="Connected Peer" className="inline-flex text-emerald-600">
                          <UserCheck className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {formatRelativeTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  <p
                    className={clsx(
                      'text-xs truncate mt-0.5',
                      unread > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500 font-normal'
                    )}
                  >
                    {conv.lastMessage || 'Started conversation'}
                  </p>
                </div>

                {unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {unread}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── ACTIVE CHAT AREA ────────────────────────────────────────
function ChatArea({
  conversationId,
  userId,
  onBack,
}: {
  conversationId: string;
  userId: string;
  onBack: () => void;
}) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeCall, setActiveCall] = useState<'video' | 'voice' | null>(null);
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  const loadMessages = async () => {
    try {
      const apiMsgs = await apiClient.getMessages(conversationId);
      setMessages(apiMsgs);
    } catch {
      // keep existing
    }
  };

  useEffect(() => {
    loadMessages();
    socketClient.joinConversation(conversationId);

    apiClient.getConversations().then((convs) => {
      const found = convs.find(c => c.id === conversationId);
      if (found) setActiveConv(found);
    }).catch(() => {});

    const unsubscribeMsg = socketClient.onMessageReceived((msg: any) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          const tempIdx = prev.findIndex((m) => m.id.startsWith('temp-') && m.senderId === msg.senderId && m.content === msg.content);
          const mappedMsg: Message = {
            id: msg.id,
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            content: msg.content,
            timestamp: msg.createdAt || new Date().toISOString(),
            isRead: true,
          };
          if (tempIdx >= 0) {
            const next = [...prev];
            next[tempIdx] = mappedMsg;
            return next;
          }
          return [...prev, mappedMsg];
        });
      }
    });

    const unsubscribeTyping = socketClient.onTypingStatus((data) => {
      if (data.conversationId === conversationId && data.userId !== userId) {
        setPeerIsTyping(data.isTyping);
      }
    });

    return () => {
      socketClient.leaveConversation(conversationId);
      unsubscribeMsg();
      unsubscribeTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [conversationId, userId]);

  const otherId = activeConv?.participantIds.find(p => p !== userId) || '';
  const rawOther = (activeConv as any)?.otherUser;
  const localOther = getUserById(otherId);
  const other = rawOther ? {
    id: rawOther.id,
    fullName: rawOther.profile?.fullName || (typeof rawOther.email === 'string' && rawOther.email.includes('@') ? rawOther.email.split('@')[0] : 'Campus Peer'),
    department: rawOther.profile?.department || 'Engineering',
    year: rawOther.profile?.currentYear || 'NIT Nagaland',
    university: rawOther.profile?.university || 'NIT Nagaland',
    avatar: rawOther.profile?.avatarUrl || '',
    role: (rawOther.role || 'mentee').toLowerCase() as any,
    onlineStatus: (rawOther.profile?.onlineStatus || 'available') as any,
  } : localOther || {
    id: otherId,
    fullName: otherId ? 'Campus Peer' : 'Peer',
    department: 'Engineering',
    year: 'NIT Nagaland',
    university: 'NIT Nagaland',
    avatar: '',
    role: 'mentee' as const,
    onlineStatus: 'available' as const,
  };
  const isConnected = otherId ? isUserConnected(userId, otherId) : false;

  useEffect(() => {
    markMessagesRead(conversationId, userId);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, conversationId, userId]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isSending) return;
    setIsSending(true);
    setInput('');

    // Stop typing immediately on submit
    socketClient.sendTyping(conversationId, false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Instant optimistic echo
    const tempId = 'temp-' + Date.now();
    const optimisticMsg: Message = {
      id: tempId,
      conversationId,
      senderId: userId,
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const sent = await apiClient.sendMessage(conversationId, content);
      if (sent) {
        setMessages(prev => prev.map(m => m.id === tempId ? sent : m));
      } else {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        addToast({ type: 'error', title: 'Message delivery failed', message: 'Could not deliver message to the server.' });
      }
    } catch (err) {
      console.warn('API sendMessage error:', err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      addToast({ type: 'error', title: 'Message delivery failed', message: 'Network or server error prevented delivery.' });
    } finally {
      setIsSending(false);
      setRefreshKey(k => k + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socketClient.sendTyping(conversationId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketClient.sendTyping(conversationId, false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Harassment or Inappropriate Conduct');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleFileReport = async () => {
    if (!otherId) return;
    setIsSubmittingReport(true);
    try {
      await apiClient.fileReport({
        reportedUserId: otherId,
        reason: reportReason,
        details: reportDetails,
        conversationId,
      });
      addToast({
        type: 'success',
        title: 'Report filed with campus safety',
        message: 'Platform administrators and moderators will inspect this conversation history.',
      });
      setReportModalOpen(false);
      setReportDetails('');
    } catch {
      addToast({
        type: 'error',
        title: 'Could not submit report',
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleConnectWithPeer = () => {
    if (!otherId) return;
    sendConnectionRequest(userId, otherId);
    addToast({
      type: 'success',
      title: 'Connection Invitation Sent',
      message: `Sent a campus connection request to ${other?.fullName}.`,
    });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
      {/* Header with Connection State */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar
            name={other?.fullName || 'User'}
            src={other?.avatar}
            size="md"
            showStatus
            status={other?.onlineStatus}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900 truncate">{other?.fullName}</p>
              {other?.role === 'admin' || other?.id === 'user-admin' || other?.fullName?.toLowerCase() === 'admin' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-100 border border-violet-200 text-[10px] font-bold text-violet-800">
                  <Shield className="w-3 h-3 text-violet-600" />
                  Platform Admin
                </span>
              ) : isConnected ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-semibold text-emerald-700">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Connected Peer
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectWithPeer}
                  className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 hover:bg-violet-100 border border-violet-200 text-[10px] font-semibold text-violet-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Connect
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {other?.department} &bull; {other?.year || other?.university}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Video Call Action */}
          <button
            type="button"
            onClick={() => setActiveCall('video')}
            className="p-2 rounded-xl text-slate-600 hover:text-violet-700 hover:bg-violet-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Start Video Tutoring Call"
          >
            <Video className="w-4 h-4 text-violet-600" />
            <span className="hidden sm:inline">Video Call</span>
          </button>

          {/* Quick Voice Call Action */}
          <button
            type="button"
            onClick={() => setActiveCall('voice')}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Start Voice Tutoring Call"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Voice Call</span>
          </button>

          {other?.id && (
            <Link
              to={`/discover/${other.id}`}
              className="text-xs font-semibold text-slate-600 hover:text-violet-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span>Profile</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}

          {/* Report Peer Action */}
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Report User for Safety or Conduct"
          >
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900">Direct Academic Channel Opened</p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Send your first message to discuss reciprocal skill barter, project collaboration, or timetable scheduling.
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.senderId === userId;
            return (
              <div key={msg.id} className={clsx('flex', isMine ? 'justify-end' : 'justify-start')}>
                <div
                  className={clsx(
                    'max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-2xs',
                    isMine
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={clsx(
                      'text-[10px] mt-1 text-right',
                      isMine ? 'text-slate-400' : 'text-slate-400'
                    )}
                  >
                    {formatRelativeTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {peerIsTyping && (
          <div className="flex justify-start">
            <div className="px-3.5 py-1.5 rounded-2xl bg-violet-50 border border-violet-200/60 text-xs text-violet-700 font-medium flex items-center gap-2 shadow-2xs animate-pulse">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>{other?.fullName || 'Peer'} is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 bg-slate-50/50"
            placeholder={`Message ${other?.fullName || 'peer'}...`}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            size="md"
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Report User Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Campus Peer"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Submit an official safety report regarding <strong className="text-slate-800">{other?.fullName}</strong>.
            Authorized campus administrators will review the report and recent conversation messages.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Report</label>
            <select
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Harassment or Inappropriate Conduct">Harassment or Inappropriate Conduct</option>
              <option value="Academic Dishonesty / Cheating Request">Academic Dishonesty / Cheating Request</option>
              <option value="Commercial Solicitation / Charging Fees">Commercial Solicitation / Charging Fees</option>
              <option value="Spam or Unwanted Messages">Spam or Unwanted Messages</option>
              <option value="No-show / Repeated Abandonment">No-show / Repeated Abandonment</option>
              <option value="Other Safety Violation">Other Safety Violation</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Details &amp; Context</label>
            <textarea
              rows={3}
              placeholder="Provide specific context or describe what occurred..."
              value={reportDetails}
              onChange={e => setReportDetails(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setReportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={isSubmittingReport}
              onClick={handleFileReport}
              className="text-xs font-bold"
            >
              {isSubmittingReport ? 'Submitting...' : 'File Official Report'}
            </Button>
          </div>
        </div>
      </Modal>

      {activeCall && (
        <TutoringCallModal
          isOpen={!!activeCall}
          onClose={() => setActiveCall(null)}
          partner={{
            id: otherId,
            fullName: other?.fullName || 'Campus Peer',
            avatar: other?.avatar,
            department: other?.department,
            role: other?.role || 'peer',
            university: other?.university || 'NIT Nagaland',
          }}
          topic="Campus Peer Tutoring & Discussion"
          initialMode={activeCall}
        />
      )}
    </div>
  );
}

// ─── CONNECTED PEERS DASHBOARD (RIGHT EMPTY STATE) ───────────
function ConnectedPeersDashboard({
  userId,
  onStartChat,
}: {
  userId: string;
  onStartChat: (peerId: string) => void;
}) {
  const [peers, setPeers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiClient.getPeerSuggestions()
      .then((data) => {
        if (active && data && Array.isArray(data)) {
          setPeers(data.filter((u: any) => u.id !== userId));
        }
      })
      .catch((e) => console.warn('Could not load campus peers:', e))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [userId]);

  return (
    <div className="hidden md:flex flex-1 flex-col overflow-y-auto p-8 bg-slate-50/50">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Campus Network Messenger</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Message Any Student or Mentor Across Campus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
            SkillBridge connects everyone in the university directory. Select any registered peer below to immediately launch a real-time messaging thread or discuss technical skill barters.
          </p>
        </div>

        {/* Peers Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Available Campus Peers ({peers.length})
            </h3>
            <Link
              to="/network"
              className="text-xs font-semibold text-violet-600 hover:underline flex items-center gap-1"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading campus peers...</div>
          ) : peers.length === 0 ? (
            <Card padding="lg" className="text-center space-y-3">
              <EmptyState
                title="No other peers registered yet"
                description="Invite classmates or browse the directory to start chatting."
                action={
                  <Link to="/network">
                    <Button size="sm">Browse Campus Network</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {peers.map(peer => (
                <div
                  key={peer.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={peer.fullName}
                      src={peer.avatar}
                      size="lg"
                      showStatus
                      status={peer.onlineStatus}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">{peer.fullName}</p>
                        <Badge variant="violet" size="sm">
                          {peer.role || 'Peer'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {peer.headline || `${peer.department} • ${peer.year}`}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{peer.university || 'NIT Nagaland'}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-medium truncate max-w-[150px]">
                      {peer.skillsOffered?.[0]?.skillName ? `Offers: ${peer.skillsOffered[0].skillName}` : peer.department}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onStartChat(peer.id)}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      className="bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl"
                    >
                      Start Messaging
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSE CHAT MODAL ──────────────────────────────────────
function ComposeChatModal({
  isOpen,
  onClose,
  userId,
  onSelectPeer,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSelectPeer: (peerId: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [directEmail, setDirectEmail] = useState('');
  const [peers, setPeers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setLoading(true);

    const currentUser = useAuthStore.getState().user;
    const isCurrentUserAdmin = currentUser?.role === 'admin' || currentUser?.id === 'user-admin';

    apiClient.getPeerSuggestions({ search: search.trim() })
      .then((data) => {
        if (active && data && Array.isArray(data) && data.length > 0) {
          const filtered = data.filter((u: any) => {
            if (u.id === userId) return false;
            if (!isCurrentUserAdmin && (u.role === 'admin' || u.id === 'user-admin' || u.fullName?.toLowerCase() === 'admin')) {
              return false;
            }
            return true;
          });
          setPeers(filtered);
        } else if (active) {
          // Local data store fallback
          const local = getUsers().filter((u) => {
            if (u.id === userId) return false;
            if (!isCurrentUserAdmin && (u.role === 'admin' || u.id === 'user-admin' || u.fullName?.toLowerCase() === 'admin')) {
              return false;
            }
            if (search.trim()) {
              const q = search.trim().toLowerCase();
              return (
                u.fullName?.toLowerCase().includes(q) ||
                u.department?.toLowerCase().includes(q) ||
                u.email?.toLowerCase().includes(q)
              );
            }
            return true;
          });
          setPeers(local);
        }
      })
      .catch(() => {
        if (active) {
          const local = getUsers().filter((u) => {
            if (u.id === userId) return false;
            if (!isCurrentUserAdmin && (u.role === 'admin' || u.id === 'user-admin' || u.fullName?.toLowerCase() === 'admin')) {
              return false;
            }
            return true;
          });
          setPeers(local);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [isOpen, search, userId]);

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directEmail.trim()) {
      onSelectPeer(directEmail.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message • Campus Student Directory">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Everyone can message everyone on SkillBridge. Select any registered classmate, mentor, or peer:
        </p>

        {/* Live Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            placeholder="Search by student name, department, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Direct Email Option */}
        <form onSubmit={handleDirectSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Or enter campus email (e.g. vidya.gupta@campus.edu)"
            value={directEmail}
            onChange={e => setDirectEmail(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500"
          />
          <Button
            size="sm"
            type="submit"
            disabled={!directEmail.trim()}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
          >
            Chat
          </Button>
        </form>

        {/* Directory List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Searching campus directory...
            </div>
          ) : peers.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching students or mentors found. You can enter an email directly above.
            </div>
          ) : (
            peers.map(peer => (
              <button
                key={peer.id}
                type="button"
                onClick={() => onSelectPeer(peer.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={peer.fullName} src={peer.avatar} size="md" showStatus status={peer.onlineStatus} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-violet-700 truncate">
                      {peer.fullName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {peer.headline || `${peer.department} • ${peer.year}`}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{peer.university || 'NIT Nagaland'}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-violet-600 group-hover:underline shrink-0 flex items-center gap-1">
                  Start Chat &rarr;
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
