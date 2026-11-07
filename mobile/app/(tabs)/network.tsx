import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { MobileApi } from '../../services/api';
import { ActivityIndicator } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  } from 'react-native';
import { UserCheck, UserPlus, ShieldCheck, Search } from 'lucide-react-native';

export default function NetworkScreen() {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'suggestions'>('suggestions');

  const [connections, setConnections] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNetwork();
  }, [activeTab]);

  const loadNetwork = async () => {
    setLoading(true);
    try {
      if (activeTab === 'connections') {
        const res = await MobileApi.getConnections();
        if (res && res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((c: any) => {
            const peer = c.partner || c.receiver || c.sender;
            return {
              id: c.id,
              name: peer?.profile?.fullName || (typeof peer?.email === 'string' ? peer.email.split('@')[0] : 'Campus Peer'),
              headline: peer?.profile?.headline || peer?.profile?.department || 'Connected Student',
              avatar: peer?.profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
              connectedAt: c.createdAt ? `Connected ${new Date(c.createdAt).toLocaleDateString()}` : 'Connected',
            };
          });
          setConnections(mapped);
        } else {
          setConnections([]);
        }
      } else {
        const res = await MobileApi.getSuggestions();
        if (res && res.data && Array.isArray(res.data)) {
          const mapped = res.data.map((s: any) => ({
            id: s.id,
            name: s.profile?.fullName || (typeof s.email === 'string' ? s.email.split('@')[0] : 'Campus Peer'),
            headline: s.profile?.headline || s.profile?.department || 'Campus Student',
            avatar: s.profile?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
            department: s.profile?.department || 'Engineering',
            mutuals: s.matchScore || 0,
            status: 'none',
          }));
          setSuggestions(mapped);
        } else {
          setSuggestions([]);
        }
      }
    } catch {
      setConnections([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id: string) => {
    try {
      await MobileApi.sendRequest(id);
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'sent' } : s))
      );
    } catch (e: any) {
      console.warn('Connect error:', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campus Network</Text>
        <Text style={styles.subtitle}>
          Connect with classmates, alumni, and verified mentors
        </Text>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'suggestions' && styles.tabActive]}
            onPress={() => setActiveTab('suggestions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'suggestions' && styles.tabTextActive,
              ]}
            >
              Discover
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'connections' && styles.tabActive]}
            onPress={() => setActiveTab('connections')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'connections' && styles.tabTextActive,
              ]}
            >
              My Network ({connections.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={activeTab === 'suggestions' ? suggestions : connections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                <ShieldCheck size={14} color="#7c3aed" />
              </View>
              <Text style={styles.headline} numberOfLines={2}>
                {item.headline}
              </Text>
              {item.mutuals && (
                <Text style={styles.mutuals}>
                  {item.mutuals} mutual campus connections
                </Text>
              )}
              {item.connectedAt && (
                <Text style={styles.mutuals}>{item.connectedAt}</Text>
              )}
            </View>

            {activeTab === 'suggestions' ? (
              <TouchableOpacity
                style={[
                  styles.connectBtn,
                  item.status === 'sent' && styles.connectBtnSent,
                ]}
                onPress={() => handleConnect(item.id)}
                disabled={item.status === 'sent'}
              >
                {item.status === 'sent' ? (
                  <>
                    <UserCheck size={14} color="#64748b" />
                    <Text style={styles.connectBtnTextSent}>Pending</Text>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} color="#ffffff" />
                    <Text style={styles.connectBtnText}>Connect</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.messageBtn}>
                <Text style={styles.messageBtnText}>Message</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  tabActive: {
    backgroundColor: '#ede9fe',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#7c3aed',
  },
  listContent: {
    padding: 12,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  headline: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  mutuals: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 3,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  connectBtnSent: {
    backgroundColor: '#f1f5f9',
  },
  connectBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  connectBtnTextSent: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  messageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600',
  },
});
