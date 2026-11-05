import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Plus } from 'lucide-react-native';

export default function MessagesScreen() {
  const router = useRouter();

  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      participantName: 'Sarah Jenkins',
      participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      lastMessage: 'Awesome! See you tomorrow at 3 PM for the Paxos review.',
      time: '12m ago',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 'conv-2',
      participantName: 'David Kim',
      participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      lastMessage: 'Did you finish question 4 of the algorithms assignment?',
      time: '2h ago',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 'conv-3',
      participantName: 'Elena Rostova',
      participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      lastMessage: 'I reviewed your PR on the PyTorch research repo. Great job!',
      time: '1d ago',
      unreadCount: 0,
      isOnline: true,
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Direct peer tutoring & study chats</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chatMeta: {
    flex: 1,
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
});
