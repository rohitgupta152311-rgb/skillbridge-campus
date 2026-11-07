import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, Video, CheckCircle, ShieldCheck, Phone, MessageSquare, Sparkles } from 'lucide-react-native';
import { TutoringCallModal } from '../../components/TutoringCallModal';

export default function MobileBookingScreen() {
  const router = useRouter();
  const { mentorId } = useLocalSearchParams();

  const [selectedSlot, setSelectedSlot] = useState('Tomorrow, 3:00 PM – 4:00 PM');
  const [topic, setTopic] = useState('Distributed Systems (Paxos & Raft)');
  const [notes, setNotes] = useState('');
  const [sessionType, setSessionType] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE');
  const [booking, setBooking] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callInitialMode, setCallInitialMode] = useState<'VIDEO' | 'VOICE'>('VIDEO');

  const mentorName = mentorId === 'mentor-2' ? 'Elena Rostova' : mentorId === 'mentor-3' ? 'Marcus Vance' : 'Sarah Jenkins';
  const mentorRole = mentorId === 'mentor-2' ? 'PhD Researcher in ML' : mentorId === 'mentor-3' ? 'Full-Stack Engineer' : 'Graduate TA & Distributed Systems Lead';
  const mentorAvatar = mentorId === 'mentor-2'
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
    : mentorId === 'mentor-3'
    ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200';

  const availableSlots = [
    'Tomorrow, 3:00 PM – 4:00 PM',
    'Thursday, 5:00 PM – 6:00 PM',
    'Friday, 2:00 PM – 3:00 PM',
  ];

  const handleConfirmBooking = async () => {
    setBooking(true);
    await new Promise((r) => setTimeout(r, 600));
    setBooking(false);

    Alert.alert(
      'Session Confirmed! 🚀',
      `Your mentorship session for "${topic}" on ${selectedSlot} has been scheduled and added to your calendar across web and mobile.`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule Tutoring Session</Text>
          <Text style={styles.subtitle}>
            Conflict-aware calendar matching with verified campus mentor
          </Text>
        </View>

        {/* Slot Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Available Slot</Text>
          <View style={styles.slotsList}>
            {availableSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotCard,
                  selectedSlot === slot && styles.slotCardActive,
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Clock
                  size={16}
                  color={selectedSlot === slot ? '#7c3aed' : '#64748b'}
                />
                <Text
                  style={[
                    styles.slotText,
                    selectedSlot === slot && styles.slotTextActive,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Topic Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Syllabus Topic / Subject</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
          />
        </View>

        {/* Session Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Session Format</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                sessionType === 'ONLINE' && styles.typeBtnActive,
              ]}
              onPress={() => setSessionType('ONLINE')}
            >
              <Video
                size={16}
                color={sessionType === 'ONLINE' ? '#7c3aed' : '#64748b'}
              />
              <Text
                style={[
                  styles.typeBtnText,
                  sessionType === 'ONLINE' && styles.typeBtnTextActive,
                ]}
              >
                Online Video Room
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                sessionType === 'IN_PERSON' && styles.typeBtnActive,
              ]}
              onPress={() => setSessionType('IN_PERSON')}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  sessionType === 'IN_PERSON' && styles.typeBtnTextActive,
                ]}
              >
                Campus Library / Lab
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes or Questions for Mentor (Optional)</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            placeholder="e.g. Please review my draft implementation of Phase 2..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmBooking}
          disabled={booking}
        >
          <Calendar size={16} color="#ffffff" />
          <Text style={styles.confirmBtnText}>
            {booking ? 'Scheduling Slot...' : 'Confirm Mentorship Booking'}
          </Text>
        </TouchableOpacity>

        {/* Instant Tutoring Live Channels */}
        <View style={styles.instantCard}>
          <View style={styles.instantHeader}>
            <Sparkles size={14} color="#7c3aed" />
            <Text style={styles.instantTitle}>Need Help Immediately?</Text>
          </View>
          <Text style={styles.instantDesc}>
            Connect with {mentorName} directly via encrypted live channels.
          </Text>

          <View style={styles.instantButtonsRow}>
            <TouchableOpacity
              style={styles.instantBtnVoice}
              onPress={() => {
                setCallInitialMode('VOICE');
                setCallModalVisible(true);
              }}
            >
              <Phone size={14} color="#7c3aed" />
              <Text style={styles.instantBtnVoiceText}>Voice Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.instantBtnVideo}
              onPress={() => {
                setCallInitialMode('VIDEO');
                setCallModalVisible(true);
              }}
            >
              <Video size={14} color="#ffffff" />
              <Text style={styles.instantBtnVideoText}>Video Room</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.instantBtnChat}
              onPress={() => {
                const convId = mentorId === 'mentor-2' ? 'conv-3' : mentorId === 'mentor-3' ? 'conv-2' : 'conv-1';
                router.push(`/chat/${convId}` as any);
              }}
            >
              <MessageSquare size={14} color="#334155" />
              <Text style={styles.instantBtnChatText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TutoringCallModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        peerName={mentorName}
        peerRole={mentorRole}
        peerAvatar={mentorAvatar}
        initialMode={callInitialMode}
        topic={topic}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 4,
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
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  slotsList: {
    gap: 8,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  slotCardActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#ede9fe',
  },
  slotText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  slotTextActive: {
    color: '#6d28d9',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  typeBtnActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#ede9fe',
  },
  typeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  typeBtnTextActive: {
    color: '#6d28d9',
    fontWeight: '700',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  instantCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  instantTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  instantDesc: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 12,
  },
  instantButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instantBtnVoice: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#ede9fe',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  instantBtnVoiceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6d28d9',
  },
  instantBtnVideo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#7c3aed',
    paddingVertical: 10,
    borderRadius: 12,
  },
  instantBtnVideoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  instantBtnChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  instantBtnChatText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
});
