import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Phone, Video, ArrowLeft, Sparkles, Check, CheckCheck } from 'lucide-react-native';
import { MobileApi } from '../../services/api';
import { SocketService } from '../../services/socket';
import { useAuth } from '../../services/auth-context';
import { TutoringCallModal } from '../../components/TutoringCallModal';

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export default function MobileChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  // Participant info (defaults to peer mentor)
  const [peer] = useState({
    name: id === 'conv-2' ? 'David Kim' : id === 'conv-3' ? 'Elena Rostova' : 'Sarah Jenkins',
    role: id === 'conv-2' ? 'Peer Student • Algorithms' : id === 'conv-3' ? 'PhD Researcher • ML' : 'Graduate TA • Distributed Systems',
    avatar: id === 'conv-2'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
      : id === 'conv-3'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    topic: 'Distributed Systems & Exam Prep',
  });

  // Call modal state
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callInitialMode, setCallInitialMode] = useState<'VIDEO' | 'VOICE'>('VIDEO');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'them',
      text: 'Hi Alex! Looking forward to reviewing the Distributed Systems assignment.',
      time: '10:30 AM',
    },
    {
      id: 'm-2',
      sender: 'me',
      text: 'Thanks Sarah! I was having trouble understanding how Paxos achieves consensus with concurrent proposers.',
      time: '10:32 AM',
    },
    {
      id: 'm-3',
      sender: 'them',
      text: 'Awesome! See you tomorrow at 3 PM for the Paxos review. Bring your draft notes!',
      time: '10:35 AM',
    },
  ]);

  const [input, setInput] = useState('');

  useEffect(() => {
    let activeSocket: any = null;
    const convId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

    if (convId && !convId.startsWith('conv-')) {
      // 1. Fetch persistent history
      MobileApi.getMessages(convId)
        .then((res) => {
          if (res && res.data && Array.isArray(res.data)) {
            const mapped = res.data.map((m: any) => ({
              id: m.id || String(Math.random()),
              sender: m.senderId === user?.id ? 'me' : 'them',
              text: m.content || m.text || '',
              time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
            }));
            if (mapped.length > 0) setMessages(mapped);
          }
        })
        .catch(() => {});

      // 2. Real-time WebSocket connection
      SocketService.connect().then((sock) => {
        activeSocket = sock;
        sock.emit('conversation:join', convId);
        sock.on('message:received', (msg: any) => {
          if (msg.conversationId === convId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [
                ...prev,
                {
                  id: msg.id,
                  sender: msg.senderId === user?.id ? 'me' : 'them',
                  text: msg.content,
                  time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
          }
        });
      });
    }

    return () => {
      if (activeSocket && convId) {
        activeSocket.emit('conversation:leave', convId);
      }
    };
  }, [id, user?.id]);

  const handleSend = () => {
    if (!input.trim()) return;
    const textToSend = input.trim();
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    const convId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
    if (convId && !convId.startsWith('conv-')) {
      const sock = SocketService.getSocket();
      if (sock && sock.connected) {
        sock.emit('message:send', { conversationId: convId, content: textToSend });
      }
      MobileApi.sendMessage(convId, textToSend).catch(() => {});
    }
  };

  const handleStartCall = (mode: 'VIDEO' | 'VOICE') => {
    setCallInitialMode(mode);
    setCallModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Call Options */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.peerAvatarWrapper}>
          <Image source={{ uri: peer.avatar }} style={styles.peerAvatar} />
          <View style={styles.onlineBadge} />
        </View>

        <View style={styles.headerTitleCol}>
          <Text style={styles.peerName} numberOfLines={1}>
            {peer.name}
          </Text>
          <Text style={styles.peerRole} numberOfLines={1}>
            {peer.role}
          </Text>
        </View>

        {/* Video & Voice Call Quick Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionBtnVoice}
            onPress={() => handleStartCall('VOICE')}
            accessibilityLabel="Start Tutoring Voice Call"
          >
            <Phone size={18} color="#7c3aed" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnVideo}
            onPress={() => handleStartCall('VIDEO')}
            accessibilityLabel="Start Tutoring Video Call"
          >
            <Video size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tutoring Call Interactive Modal */}
      <TutoringCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        peerName={peer.name}
        peerRole={peer.role}
        peerAvatar={peer.avatar}
        initialMode={callInitialMode}
        topic={peer.topic}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Topic Suggestion Banner */}
        <View style={styles.topicBanner}>
          <Sparkles size={12} color="#7c3aed" />
          <Text style={styles.topicBannerText}>
            Topic: <Text style={styles.topicHighlight}>{peer.topic}</Text>
          </Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => {
            const isMe = item.sender === 'me';
            return (
              <View
                style={[
                  styles.bubbleWrapper,
                  isMe ? styles.bubbleMeWrapper : styles.bubbleThemWrapper,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isMe ? styles.bubbleMeText : styles.bubbleThemText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <View style={styles.bubbleFooter}>
                    <Text
                      style={[
                        styles.bubbleTime,
                        isMe ? styles.bubbleMeTime : styles.bubbleThemTime,
                      ]}
                    >
                      {item.time}
                    </Text>
                    {isMe && <CheckCheck size={11} color="#e9d5ff" />}
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message or ask a question..."
            value={input}
            onChangeText={setInput}
            multiline
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Send size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
  },
  peerAvatarWrapper: {
    position: 'relative',
  },
  peerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  headerTitleCol: {
    flex: 1,
  },
  peerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  peerRole: {
    fontSize: 11,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnVoice: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  actionBtnVideo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  keyboardView: {
    flex: 1,
  },
  topicBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  topicBannerText: {
    fontSize: 11,
    color: '#5b21b6',
  },
  topicHighlight: {
    fontWeight: '700',
  },
  messageList: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
  },
  bubbleMeWrapper: {
    justifyContent: 'flex-end',
  },
  bubbleThemWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: '#7c3aed',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleMeText: {
    color: '#ffffff',
  },
  bubbleThemText: {
    color: '#0f172a',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 9,
  },
  bubbleMeTime: {
    color: '#e9d5ff',
  },
  bubbleThemTime: {
    color: '#94a3b8',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    maxHeight: 100,
    color: '#0f172a',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#cbd5e1',
  },
});
