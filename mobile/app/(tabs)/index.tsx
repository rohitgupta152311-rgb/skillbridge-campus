import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  X,
  Sparkles,
  GraduationCap,
} from 'lucide-react-native';
import { useAuth } from '../../services/auth-context';
import { MobileApi } from '../../services/api';

export default function FeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // New post modal
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);

  const initialPosts = [
    {
      id: 'p-1',
      authorName: 'Alex Chen',
      authorHeadline: 'Junior Computer Science Major',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      timeAgo: '2h ago',
      content:
        '🚀 Just pushed our new open-source Campus Peer Tutoring backend architecture! Built with Node.js, TypeScript, PostgreSQL, and Socket.IO for real-time messaging. Looking for peers to test our 5-factor matching algorithm.',
      likes: 18,
      comments: 6,
      liked: false,
      tags: ['TypeScript', 'NodeJS', 'SystemDesign'],
    },
    {
      id: 'p-2',
      authorName: 'Sarah Jenkins',
      authorHeadline: 'Distributed Systems TA & Peer Mentor',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      timeAgo: '4h ago',
      content:
        'Hosting an open review session this Thursday at 5 PM on Cache Coherence and Paxos Consensus. Available for 1-on-1 tutoring slots on StudyBridge for midterm prep! Drop your questions below.',
      likes: 42,
      comments: 14,
      liked: true,
      tags: ['StudyGroup', 'Algorithms', 'Mentorship'],
    },
    {
      id: 'p-3',
      authorName: 'David Kim',
      authorHeadline: 'Sophomore Software Engineering',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      timeAgo: 'Yesterday',
      content:
        'Big shoutout to Sarah Jenkins for the mentorship session on Dynamic Programming! Solved all memoization practice problems for CS301 with her guidance. StudyBridge matching works wonders.',
      likes: 29,
      comments: 3,
      liked: false,
      tags: ['SuccessStory', 'PeerLearning'],
    },
  ];

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const res = await MobileApi.getFeed();
      if (res && res.data && res.data.posts) {
        setPosts(res.data.posts);
      } else {
        setPosts(initialPosts);
      }
    } catch {
      setPosts(initialPosts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFeed();
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextLiked = !p.liked;
          return {
            ...p,
            liked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    setPosting(true);

    const newPost = {
      id: `p-${Date.now()}`,
      authorName: user?.profile?.fullName || 'Campus Peer',
      authorHeadline: user?.profile?.headline || 'StudyBridge Member',
      authorAvatar:
        user?.profile?.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      timeAgo: 'Just now',
      content: postContent,
      likes: 1,
      comments: 0,
      liked: true,
      tags: ['CampusCommunity'],
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
    setPosting(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Mobile Bar */}
      <View style={styles.header}>
        <View style={styles.logoGroup}>
          <View style={styles.logoIcon}>
            <GraduationCap color="#ffffff" size={18} />
          </View>
          <Text style={styles.brandTitle}>StudyBridge</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3.0</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => setModalVisible(true)}
        >
          <Plus color="#ffffff" size={16} />
          <Text style={styles.createBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* Author Row */}
              <View style={styles.authorRow}>
                <Image
                  source={{ uri: item.authorAvatar }}
                  style={styles.avatar}
                />
                <View style={styles.authorMeta}>
                  <Text style={styles.authorName}>{item.authorName}</Text>
                  <Text style={styles.authorHeadline} numberOfLines={1}>
                    {item.authorHeadline}
                  </Text>
                  <Text style={styles.timeAgo}>{item.timeAgo}</Text>
                </View>
              </View>

              {/* Post Content */}
              <Text style={styles.content}>{item.content}</Text>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {item.tags.map((t: string) => (
                    <View key={t} style={styles.tagPill}>
                      <Text style={styles.tagText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Bar */}
              <View style={styles.actionBar}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleLike(item.id)}
                >
                  <ThumbsUp
                    size={16}
                    color={item.liked ? '#7c3aed' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      item.liked && styles.actionTextActive,
                    ]}
                  >
                    {item.likes}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <MessageCircle size={16} color="#64748b" />
                  <Text style={styles.actionText}>{item.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Share2 size={16} color="#64748b" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Bookmark size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Create Post Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Campus Update</Text>
            <TouchableOpacity
              style={styles.publishBtn}
              onPress={handleCreatePost}
              disabled={posting}
            >
              <Text style={styles.publishBtnText}>Publish</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <TextInput
              style={styles.input}
              placeholder="What are you learning, building, or researching today?"
              multiline
              autoFocus
              value={postContent}
              onChangeText={setPostContent}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#ede9fe',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6d28d9',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  authorHeadline: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  timeAgo: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  content: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  actionTextActive: {
    color: '#7c3aed',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  publishBtn: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  publishBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  input: {
    fontSize: 16,
    color: '#0f172a',
    lineHeight: 24,
    textAlignVertical: 'top',
    flex: 1,
  },
});
