import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Phone, Video, Search, Sparkles } from 'lucide-react-native';
import { MobileApi } from '../../services/api';
import { TutoringCallModal } from '../../components/TutoringCallModal';

export default function MessagesScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Call modal state
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callInitialMode, setCallInitialMode] = useState<'VIDEO' | 'VOICE'>('VIDEO');
  const [activeCallPeer, setActiveCallPeer] = useState({
    name: 'Sarah Jenkins',
    role: 'Graduate TA & Distributed Systems Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    topic: 'Distributed Systems & Exam Prep',
  });

  const initialConversations = [
    {
      id: 'conv-1',
      participantName: 'Sarah Jenkins',
      participantRole: 'Graduate TA & Distributed Systems Lead',
      participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      lastMessage: 'Awesome! See you tomorrow at 3 PM for the Paxos review.',
      time: '12m ago',
      unreadCount: 1,
      isOnline: true,
      topic: 'Distributed Systems & Paxos Review',
    },
    {
      id: 'conv-2',
      participantName: 'David Kim',
      participantRole: 'Sophomore • Algorithms & Data Structures',
      participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      lastMessage: 'Did you finish question 4 of the algorithms assignment?',
      time: '2h ago',
      unreadCount: 0,
      isOnline: false,
      topic: 'Algorithms CS301',
    },
    {
      id: 'conv-3',
      participantName: 'Elena Rostova',
      participantRole: 'PhD Researcher in Deep Learning',
      participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      lastMessage: 'I reviewed your PR on the PyTorch research repo. Great job!',
      time: '1d ago',
      unreadCount: 0,
      isOnline: true,
      topic: 'Deep Learning & PyTorch',
    },
  ];

  const [conversations, setConversations] = useState(initialConversations);

  const loadConversations = async () => {
    try {
      const res = await MobileApi.getConversations();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((c: any) => ({
          id: c.id,
          participantName: c.participant?.profile?.fullName || c.participant?.email || 'Campus Peer',
          participantRole: c.participant?.profile?.headline || 'StudyBridge Member',
          participantAvatar: c.participant?.profile?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
          lastMessage: c.lastMessage?.content || 'Started a new conversation',
          time: c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
          unreadCount: c.unreadCount || 0,
          isOnline: true,
          topic: 'Peer Mentoring Session',
        }));
        setConversations(mapped);
      } else {
        setConversations(initialConversations);
      }
    } catch {
      setConversations(initialConversations);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const handleStartCall = (conv: any, mode: 'VIDEO' | 'VOICE') => {
    setActiveCallPeer({
      name: conv.participantName,
      role: conv.participantRole,
      avatar: conv.participantAvatar,
      topic: conv.topic,
    });
    setCallInitialMode(mode);
    setCallModalVisible(true);
  };

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Messages & Tutoring</Text>
            <Text style={styles.subtitle}>Direct peer tutoring, voice & video rooms</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations or peers..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tutoring Call Modal */}
      <TutoringCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        peerName={activeCallPeer.name}
        peerRole={activeCallPeer.role}
        peerAvatar={activeCallPeer.avatar}
        initialMode={callInitialMode}
        topic={activeCallPeer.topic}
      />

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#7c3aed" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRow}
            onPress={() => router.push(`/chat/${item.id}` as any)}
          >
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: item.participantAvatar }} style={styles.avatar} />
              {item.isOnline && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.chatMeta}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{item.participantName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>

              <View style={styles.bottomRow}>
                <Text
                  style={[
                    styles.lastMessage,
                    item.unreadCount > 0 && styles.lastMessageUnread,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Quick Voice & Video Actions */}
            <View style={styles.rowActions}>
              <TouchableOpacity
                style={styles.rowActionBtnVoice}
                onPress={() => handleStartCall(item, 'VOICE')}
                accessibilityLabel="Start Voice Call"
              >
                <Phone size={15} color="#7c3aed" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowActionBtnVideo}
                onPress={() => handleStartCall(item, 'VIDEO')}
                accessibilityLabel="Start Video Call"
              >
                <Video size={15} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  listContent: {
    paddingVertical: 4,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatMeta: {
    flex: 1,
    marginRight: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  time: {
    fontSize: 11,
    color: '#94a3b8',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    fontWeight: '700',
    color: '#0f172a',
  },
  unreadBadge: {
    backgroundColor: '#7c3aed',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowActionBtnVoice: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  rowActionBtnVideo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
