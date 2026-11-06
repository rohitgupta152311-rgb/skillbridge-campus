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
} from 'lucide-react';
import { Avatar, Card, Badge, EmptyState, Button, Modal } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import {
  getConversationsByUser,
  getMessagesByConversation,
  getUserById,
  addMessage,
  markMessagesRead,
  getOrCreateConversation,
  getConnectedUsers,
  isUserConnected,
  sendConnectionRequest,
} from '../../infrastructure/local-storage/data-service';
import { formatRelativeTime } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import { User } from '../../foundation/types';
import clsx from 'clsx';

export function ConversationCenterPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] flex bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-fade-in">
      {/* ── CONVERSATION SIDEBAR ── */}
      <ConversationList
        userId={user.id}
        activeId={conversationId}
        search={searchTerm}
        onSearch={setSearchTerm}
        onOpenCompose={() => setIsComposeOpen(true)}
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
          onStartChat={(peerId) => {
            const conv = getOrCreateConversation(user.id, peerId);
            navigate(`/messages/${conv.id}`);
          }}
        />
      )}

      {/* ── COMPOSE MODAL (START CHAT WITH CONNECTED PEER) ── */}
      <ComposeChatModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        userId={user.id}
        onSelectPeer={(peerId) => {
          const conv = getOrCreateConversation(user.id, peerId);
          setIsComposeOpen(false);
          navigate(`/messages/${conv.id}`);
        }}
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
  className,
}: {
  userId: string;
  activeId?: string;
  search: string;
  onSearch: (s: string) => void;
  onOpenCompose: () => void;
  className?: string;
}) {
  const navigate = useNavigate();

  const conversations = useMemo(() => {
    const convs = getConversationsByUser(userId);
    return convs.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [userId]);

  const connectedPeers = useMemo(() => getConnectedUsers(userId), [userId]);

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const other = getUserById(c.participantIds.find(p => p !== userId) || '');
    return other?.fullName.toLowerCase().includes(search.toLowerCase());
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

      {/* ── CONNECTED PEERS TRAY ── */}
      {connectedPeers.length > 0 && !search && (
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-violet-600" />
              Connected Peers ({connectedPeers.length})
            </span>
            <Link
              to="/network"
              className="text-[10px] font-semibold text-violet-600 hover:underline"
            >
              View Network &rarr;
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {connectedPeers.map(peer => (
              <button
                key={peer.id}
                type="button"
                onClick={() => {
                  const conv = getOrCreateConversation(userId, peer.id);
                  navigate(`/messages/${conv.id}`);
                }}
                className="group flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-white border border-transparent hover:border-slate-200/80 transition-all text-center flex-shrink-0 w-16"
                title={`Chat with ${peer.fullName}`}
              >
                <div className="relative">
                  <Avatar name={peer.fullName} src={peer.avatar} size="md" showStatus status={peer.onlineStatus} />
                </div>
                <span className="text-[10px] font-medium text-slate-700 truncate w-full group-hover:text-violet-700">
                  {peer.fullName.split(' ')[0]}
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
                Reach out to your connected classmates and peer mentors to start chatting.
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
            const other = getUserById(otherId);
            const unread = conv.unreadCount[userId] || 0;
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
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastStore();

  const messages = useMemo(
    () => getMessagesByConversation(conversationId),
    [conversationId, refreshKey]
  );

  const conversation = useMemo(() => {
    const convs = getConversationsByUser(userId);
    return convs.find(c => c.id === conversationId);
  }, [conversationId, userId]);

  const otherId = conversation?.participantIds.find(p => p !== userId) || '';
  const other = getUserById(otherId);
  const isConnected = isUserConnected(userId, otherId);

  useEffect(() => {
    markMessagesRead(conversationId, userId);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, conversationId, userId]);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage({ conversationId, senderId: userId, content: input.trim() });
    setInput('');
    setRefreshKey(k => k + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
              {isConnected ? (
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
          {other?.id && (
            <Link
              to={`/discover/${other.id}`}
              className="text-xs font-semibold text-slate-600 hover:text-violet-700 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span>Profile</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 bg-slate-50/50"
            placeholder={`Message ${other?.fullName || 'peer'}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
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
  const connectedPeers = useMemo(() => getConnectedUsers(userId), [userId]);

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
            Connect &amp; Message Your Campus Peers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
            You are connected with {connectedPeers.length} fellow students and mentors. Select any connected peer below to immediately open a chat thread or propose a technical skill barter.
          </p>
        </div>

        {/* Connected Peers Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Your Connected Peers ({connectedPeers.length})
            </h3>
            <Link
              to="/network"
              className="text-xs font-semibold text-violet-600 hover:underline flex items-center gap-1"
            >
              <span>Manage Network</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {connectedPeers.length === 0 ? (
            <Card padding="lg" className="text-center space-y-3">
              <EmptyState
                title="No connected peers yet"
                description="Connect with classmates in your department or browse mentors in the network."
                action={
                  <Link to="/network">
                    <Button size="sm">Browse Campus Network</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {connectedPeers.map(peer => (
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
                        <Badge variant="success" size="sm">
                          Connected
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {peer.headline || `${peer.department} • ${peer.year}`}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{peer.university}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-medium truncate max-w-[150px]">
                      Teaches: {peer.skillsOffered?.[0]?.skillName || 'Engineering'}
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
  const connectedPeers = useMemo(() => getConnectedUsers(userId), [userId]);

  const filtered = connectedPeers.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(s) ||
      p.department.toLowerCase().includes(s) ||
      (p.headline || '').toLowerCase().includes(s)
    );
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message to Connected Peer">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Select any connected classmate or mentor from your professional network to start chatting:
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            placeholder="Search by name, department, or topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching connected peers found.
            </div>
          ) : (
            filtered.map(peer => (
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
                    <p className="text-[11px] text-slate-500 truncate">{peer.department} &bull; {peer.year}</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-violet-600 group-hover:underline shrink-0">
                  Chat &rarr;
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
