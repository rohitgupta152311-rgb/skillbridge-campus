import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Share2,
  FileText,
  X,
  ShieldCheck,
  Clock,
} from 'lucide-react-native';

interface TutoringCallModalProps {
  visible: boolean;
  onClose: () => void;
  peerName: string;
  peerRole?: string;
  peerAvatar?: string;
  initialMode?: 'VIDEO' | 'VOICE';
  topic?: string;
}

export const TutoringCallModal: React.FC<TutoringCallModalProps> = ({
  visible,
  onClose,
  peerName,
  peerRole = 'Campus Peer Mentor',
  peerAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  initialMode = 'VIDEO',
  topic = 'Peer Tutoring & Review Session',
}) => {
  const [callMode, setCallMode] = useState<'VIDEO' | 'VOICE'>(initialMode);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(initialMode === 'VIDEO');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(
    `# Tutoring Session Notes: ${topic}\n- Key Concept 1: \n- Formulas:\n- Questions for Next Session:`
  );
  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    setCallMode(initialMode);
    setIsVideoOn(initialMode === 'VIDEO');
  }, [initialMode, visible]);

  useEffect(() => {
    let timer: any = null;
    if (visible) {
      setDurationSeconds(0);
      timer = setInterval(() => {
        setDurationSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleEndCall}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View style={styles.headerInfo}>
            <View style={styles.encryptionBadge}>
              <ShieldCheck size={12} color="#10b981" />
              <Text style={styles.encryptionText}>E2E Encrypted HD Peer Call</Text>
            </View>
            <Text style={styles.callTopic} numberOfLines={1}>
              {topic}
            </Text>
          </View>

          <View style={styles.timerPill}>
            <Clock size={12} color="#ffffff" />
            <Text style={styles.timerText}>{formatTimer(durationSeconds)}</Text>
          </View>
        </View>

        {/* Mode Switcher Tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, callMode === 'VIDEO' && styles.modeTabActive]}
            onPress={() => {
              setCallMode('VIDEO');
              setIsVideoOn(true);
            }}
          >
            <Video size={14} color={callMode === 'VIDEO' ? '#ffffff' : '#94a3b8'} />
            <Text
              style={[
                styles.modeTabText,
                callMode === 'VIDEO' && styles.modeTabTextActive,
              ]}
            >
              Video Room
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeTab, callMode === 'VOICE' && styles.modeTabActive]}
            onPress={() => {
              setCallMode('VOICE');
              setIsVideoOn(false);
            }}
          >
            <Phone size={14} color={callMode === 'VOICE' ? '#ffffff' : '#94a3b8'} />
            <Text
              style={[
                styles.modeTabText,
                callMode === 'VOICE' && styles.modeTabTextActive,
              ]}
            >
              HD Voice Call
            </Text>
          </TouchableOpacity>
        </View>

        {/* Center Stage: Video or Voice */}
        {callMode === 'VIDEO' ? (
          <View style={styles.videoStage}>
            {/* Remote Peer Stream */}
            <View style={styles.remoteVideoContainer}>
              <Image source={{ uri: peerAvatar }} style={styles.remoteVideoImg} />
              <View style={styles.remoteVideoOverlay}>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE TUTORING</Text>
                </View>
                <Text style={styles.remotePeerName}>{peerName}</Text>
                <Text style={styles.remotePeerRole}>{peerRole}</Text>
              </View>
            </View>

            {/* Local PIP Self-View */}
            {isVideoOn && (
              <View style={styles.pipView}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
                  }}
                  style={styles.pipImg}
                />
                <View style={styles.pipBadge}>
                  <Text style={styles.pipBadgeText}>You (Front Camera)</Text>
                </View>
              </View>
            )}

            {isScreenSharing && (
              <View style={styles.screenShareBanner}>
                <Share2 size={14} color="#ffffff" />
                <Text style={styles.screenShareText}>
                  Broadcasting Campus Workspace & Code Editor
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.voiceStage}>
            <View style={styles.pulseContainer}>
              <View style={styles.pulseRingOuter} />
              <View style={styles.pulseRingMiddle} />
              <Image source={{ uri: peerAvatar }} style={styles.voiceAvatar} />
            </View>

            <Text style={styles.voicePeerName}>{peerName}</Text>
            <Text style={styles.voicePeerRole}>{peerRole}</Text>
            <Text style={styles.voiceStatus}>HD Spatial Audio Connected</Text>

            {/* Dynamic Waveform Visualizer */}
            <View style={styles.waveVisualizer}>
              {[28, 44, 18, 62, 34, 52, 22, 58, 40, 66, 30, 48, 20].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: isMuted ? 8 : h,
                      backgroundColor: isMuted ? '#475569' : '#a855f7',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* In-Call Notes Modal Drawer */}
        {showNotes && (
          <View style={styles.notesDrawer}>
            <View style={styles.notesHeader}>
              <View style={styles.notesTitleRow}>
                <FileText size={16} color="#7c3aed" />
                <Text style={styles.notesTitle}>Collaborative Scratchpad</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotes(false)}
                style={styles.notesCloseBtn}
              >
                <X size={16} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.notesInput}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Jot down notes, formulas, algorithm steps..."
              placeholderTextColor="#94a3b8"
            />
          </View>
        )}

        {/* Bottom Control Bar */}
        <View style={styles.bottomBar}>
          {/* Mute Button */}
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.controlBtnActiveRed]}
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <MicOff size={22} color="#ffffff" />
            ) : (
              <Mic size={22} color="#ffffff" />
            )}
            <Text style={styles.controlBtnLabel}>{isMuted ? 'Muted' : 'Mic'}</Text>
          </TouchableOpacity>

          {/* Video Toggle */}
          <TouchableOpacity
            style={[styles.controlBtn, !isVideoOn && styles.controlBtnActiveGray]}
            onPress={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? (
              <Video size={22} color="#ffffff" />
            ) : (
              <VideoOff size={22} color="#ffffff" />
            )}
            <Text style={styles.controlBtnLabel}>{isVideoOn ? 'Camera' : 'Off'}</Text>
          </TouchableOpacity>

          {/* Speaker Toggle */}
          <TouchableOpacity
            style={[styles.controlBtn, !isSpeakerOn && styles.controlBtnActiveGray]}
            onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? (
              <Volume2 size={22} color="#ffffff" />
            ) : (
              <VolumeX size={22} color="#ffffff" />
            )}
            <Text style={styles.controlBtnLabel}>{isSpeakerOn ? 'Speaker' : 'Ear'}</Text>
          </TouchableOpacity>

          {/* Screen Share */}
          <TouchableOpacity
            style={[styles.controlBtn, isScreenSharing && styles.controlBtnActivePurple]}
            onPress={() => setIsScreenSharing(!isScreenSharing)}
          >
            <Share2 size={22} color="#ffffff" />
            <Text style={styles.controlBtnLabel}>Share</Text>
          </TouchableOpacity>

          {/* Notes Toggle */}
          <TouchableOpacity
            style={[styles.controlBtn, showNotes && styles.controlBtnActivePurple]}
            onPress={() => setShowNotes(!showNotes)}
          >
            <FileText size={22} color="#ffffff" />
            <Text style={styles.controlBtnLabel}>Notes</Text>
          </TouchableOpacity>

          {/* End Call Button */}
          <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
            <PhoneOff size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  encryptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  callTopic: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modeTabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
  },
  modeTabActive: {
    backgroundColor: '#7c3aed',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  modeTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  videoStage: {
    flex: 1,
    position: 'relative',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  remoteVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  remoteVideoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 12,
    borderRadius: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  remotePeerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  remotePeerRole: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  pipView: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 105,
    height: 145,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#7c3aed',
    backgroundColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  pipImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  pipBadgeText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '700',
  },
  screenShareBanner: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  screenShareText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  voiceStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pulseContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRingOuter: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  pulseRingMiddle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
  },
  voiceAvatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: '#7c3aed',
  },
  voicePeerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  voicePeerRole: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  voiceStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 24,
  },
  waveVisualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 70,
    marginTop: 10,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
  },
  notesDrawer: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    right: 16,
    height: 220,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  notesCloseBtn: {
    padding: 4,
  },
  notesInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    color: '#f8fafc',
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: 'top',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  controlBtn: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  controlBtnActiveRed: {
    backgroundColor: '#ef4444',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  controlBtnActiveGray: {
    opacity: 0.4,
  },
  controlBtnActivePurple: {
    backgroundColor: '#7c3aed',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  controlBtnLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  endCallBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
