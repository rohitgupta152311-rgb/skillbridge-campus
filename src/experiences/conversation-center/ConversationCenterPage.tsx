import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Search } from 'lucide-react';
import { Avatar, Card, Badge, EmptyState } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getConversationsByUser, getMessagesByConversation, getUserById, addMessage, markMessagesRead } from '../../infrastructure/local-storage/data-service';
import { formatRelativeTime } from '../../foundation/helpers';
import clsx from 'clsx';

export function ConversationCenterPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] flex bg-white rounded-xl border border-slate-200 overflow-hidden animate-fade-in">
      {/* Conversation List */}
      <ConversationList userId={user.id} activeId={conversationId} search={searchTerm} onSearch={setSearchTerm} className={clsx('w-full md:w-80 lg:w-96 border-r border-slate-200', conversationId && 'hidden md:flex')} />

      {/* Chat Area */}
      {conversationId ? (
        <ChatArea conversationId={conversationId} userId={user.id} onBack={() => navigate('/messages')} />
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <EmptyState title="Select a conversation" description="Choose a conversation from the list to start chatting." />
        </div>
      )}
    </div>
  );
}

function ConversationList({ userId, activeId, search, onSearch, className }: { userId: string; activeId?: string; search: string; onSearch: (s: string) => void; className?: string }) {
  const navigate = useNavigate();
  const conversations = useMemo(() => {
    const convs = getConversationsByUser(userId);
    return convs.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  }, [userId]);

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const other = getUserById(c.participantIds.find(p => p !== userId) || '');
    return other?.fullName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-400"
            placeholder="Search conversations..." value={search} onChange={e => onSearch(e.target.value)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">No conversations yet.</div>
        ) : (
          filtered.map(conv => {
            const otherId = conv.participantIds.find(p => p !== userId) || '';
            const other = getUserById(otherId);
            const unread = conv.unreadCount[userId] || 0;
            const isActive = conv.id === activeId;
            return (
              <button key={conv.id} onClick={() => navigate(`/messages/${conv.id}`)}
                className={clsx('w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100', isActive && 'bg-violet-50 hover:bg-violet-50')}>
                <Avatar name={other?.fullName || 'User'} size="md" showStatus status={other?.onlineStatus} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={clsx('text-sm truncate', unread > 0 ? 'font-semibold text-slate-900' : 'font-medium text-slate-700')}>{other?.fullName}</span>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatRelativeTime(conv.lastMessageAt)}</span>
                  </div>
                  <p className={clsx('text-xs truncate mt-0.5', unread > 0 ? 'text-slate-700 font-medium' : 'text-slate-400')}>{conv.lastMessage || 'No messages yet'}</p>
                </div>
                {unread > 0 && <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center flex-shrink-0">{unread}</span>}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function ChatArea({ conversationId, userId, onBack }: { conversationId: string; userId: string; onBack: () => void }) {
  const [input, setInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => getMessagesByConversation(conversationId), [conversationId, refreshKey]);
  const conversation = useMemo(() => {
    const convs = getConversationsByUser(userId);
    return convs.find(c => c.id === conversationId);
  }, [conversationId, userId]);

  const otherId = conversation?.participantIds.find(p => p !== userId) || '';
  const other = getUserById(otherId);

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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
        <button onClick={onBack} className="md:hidden p-1 rounded-lg hover:bg-slate-100"><ArrowLeft className="w-5 h-5 text-slate-500" /></button>
        <Avatar name={other?.fullName || 'User'} size="sm" showStatus status={other?.onlineStatus} />
        <div>
          <p className="text-sm font-semibold text-slate-900">{other?.fullName}</p>
          <p className="text-xs text-slate-400 capitalize">{other?.onlineStatus}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const isMine = msg.senderId === userId;
          return (
            <div key={msg.id} className={clsx('flex', isMine ? 'justify-end' : 'justify-start')}>
              <div className={clsx('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed', isMine ? 'bg-violet-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-900 rounded-bl-md')}>
                <p>{msg.content}</p>
                <p className={clsx('text-[10px] mt-1', isMine ? 'text-violet-200' : 'text-slate-400')}>{formatRelativeTime(msg.timestamp)}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20"
            placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
          <button onClick={handleSend} disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 disabled:opacity-40 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
