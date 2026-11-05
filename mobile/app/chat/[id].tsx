import React, { useState } from 'react';
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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Send, Phone, Video } from 'lucide-react-native';

export default function MobileChatScreen() {
  const { id } = useLocalSearchParams();

  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'mentor',
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
      sender: 'mentor',
      text: 'Awesome! See you tomorrow at 3 PM for the Paxos review. Bring your draft notes!',
      time: '10:35 AM',
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: input.trim(),
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
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
                  <Text
                    style={[
                      styles.bubbleTime,
                      isMe ? styles.bubbleMeTime : styles.bubbleThemTime,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
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
  keyboardView: {
    flex: 1,
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
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
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
});
