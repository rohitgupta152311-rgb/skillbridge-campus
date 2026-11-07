import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Star,
  Clock,
  CheckCircle,
  Calendar,
  Filter,
  Phone,
  Video,
  MessageSquare,
} from 'lucide-react-native';
import { TutoringCallModal } from '../../components/TutoringCallModal';
import { MobileApi } from '../../services/api';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function MentorshipScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callInitialMode, setCallInitialMode] = useState<'VIDEO' | 'VOICE'>('VIDEO');
  const [activeCallPeer, setActiveCallPeer] = useState({
    name: 'Sarah Jenkins',
    role: 'Graduate TA & Distributed Systems Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    topic: 'Distributed Systems & Exam Prep',
  });

  const handleStartCall = (mentor: any, mode: 'VIDEO' | 'VOICE') => {
    setActiveCallPeer({
      name: mentor.name,
      role: mentor.role,
      avatar: mentor.avatar,
      topic: mentor.topics?.[0] || 'Peer Mentorship Session',
    });
    setCallInitialMode(mode);
    setCallModalVisible(true);
  };

  const topics = ['All', 'Algorithms & DSA', 'Distributed Systems', 'Machine Learning', 'Full-Stack Web', 'Operating Systems'];

  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, [selectedTopic]);

  const loadMentors = async () => {
    setLoading(true);
    try {
      const res = await MobileApi.getMentors(selectedTopic === 'All' ? undefined : selectedTopic);
      if (res && res.data && Array.isArray(res.data)) {
        const mapped = res.data.map((item: any) => {
          const m = item.mentor || item;
          return {
            id: m.id,
            name: m.profile?.fullName || (typeof m.email === 'string' ? m.email.split('@')[0] : 'Campus Mentor'),
            role: m.profile?.headline || m.profile?.department || 'Verified Peer Mentor',
            avatar: m.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            matchScore: item.matchScore || 85,
            rating: m.averageRating || 4.8,
            reviewsCount: m.totalReviews || 0,
            topics: Array.isArray(m.expertise) && m.expertise.length > 0 ? m.expertise.map((e: any) => e.topic) : ['Peer Tutoring'],
            availability: Array.isArray(m.availability) && m.availability.length > 0 ? `${m.availability[0].dayOfWeek}, ${m.availability[0].startTime}` : 'Available on request',
          };
        });
        setMentorsList(mapped);
      } else {
        setMentorsList([]);
      }
    } catch {
      setMentorsList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.engineBadge}>
              <Sparkles size={12} color="#7c3aed" />
              <Text style={styles.engineBadgeText}>5-Factor AI Matchmaking</Text>
            </View>
            <Text style={styles.title}>Find Peer Mentors</Text>
          </View>
        </View>

        {/* Topic Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {topics.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.topicChip, selectedTopic === t && styles.topicChipActive]}
              onPress={() => setSelectedTopic(t)}
            >
              <Text
                style={[
                  styles.topicChipText,
                  selectedTopic === t && styles.topicChipTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={mentorsList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#7c3aed" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Sparkles size={36} color="#7c3aed" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No Mentors Available</Text>
              <Text style={styles.emptySubtitle}>
                No verified peer mentors are currently listed for "{selectedTopic}". Try selecting another category or check back soon!
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Match Header */}
            <View style={styles.matchBar}>
              <View style={styles.scorePill}>
                <Sparkles size={12} color="#ffffff" />
                <Text style={styles.scoreText}>{item.matchScore}% Match</Text>
              </View>
              <Text style={styles.breakdownSummary}>
                Topic 35% • Sched 25% • Rating 20%
              </Text>
            </View>

            {/* Mentor Info */}
            <View style={styles.body}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>{item.role}</Text>

                <View style={styles.ratingRow}>
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.ratingText}>
                    {item.rating} ({item.reviewsCount} reviews)
                  </Text>
                </View>
              </View>
            </View>

            {/* Topics */}
            <View style={styles.topicsRow}>
              {item.topics.map((top: string) => (
                <View key={top} style={styles.topPill}>
                  <Text style={styles.topText}>{top}</Text>
                </View>
              ))}
            </View>

            {/* Footer Slot & Tutoring Quick Actions */}
            <View style={styles.footer}>
              <View style={styles.slotInfo}>
                <Clock size={12} color="#64748b" />
                <Text style={styles.slotText} numberOfLines={1}>{item.availability}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.cardActionMsg}
                  onPress={() => router.push(`/chat/${item.id}` as any)}
                  accessibilityLabel="Message Mentor"
                >
                  <MessageSquare size={13} color="#475569" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardActionVoice}
                  onPress={() => handleStartCall(item, 'VOICE')}
                  accessibilityLabel="Voice Call"
                >
                  <Phone size={13} color="#7c3aed" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardActionVideo}
                  onPress={() => handleStartCall(item, 'VIDEO')}
                  accessibilityLabel="Video Call"
                >
                  <Video size={13} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => router.push(`/booking/${item.id}` as any)}
                >
                  <Calendar size={13} color="#ffffff" />
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TutoringCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        peerName={activeCallPeer.name}
        peerRole={activeCallPeer.role}
        peerAvatar={activeCallPeer.avatar}
        initialMode={callInitialMode}
        topic={activeCallPeer.topic}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
    marginBottom: 10,
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ede9fe',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6d28d9',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  filterScroll: {
    paddingBottom: 10,
    gap: 8,
  },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  topicChipActive: {
    backgroundColor: '#7c3aed',
  },
  topicChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  topicChipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  matchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ede9fe',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  breakdownSummary: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6d28d9',
  },
  body: {
    flexDirection: 'row',
    padding: 14,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  role: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  topPill: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topText: {
    fontSize: 11,
    color: '#475569',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slotText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    maxWidth: 100,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardActionMsg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardActionVoice: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  cardActionVideo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bookBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
