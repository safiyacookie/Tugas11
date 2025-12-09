// src/screen/ChatScreen.js
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { clearUser, getSavedUser } from "../storage/authStorage";
import {
  loadChatHistory,
  saveChatHistory,
} from "../storage/chatStorage";

const ChatScreen = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingInit, setLoadingInit] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const init = async () => {
      const u = await getSavedUser();
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);

      const history = await loadChatHistory();
      setMessages(history || []);

      setLoadingInit(false);
    };

    init();
  }, []);

  const appendMessage = async (msg) => {
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    await saveChatHistory(newMessages);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setSending(true);
    const msg = {
      id: Date.now().toString(),
      type: "text",
      text: input.trim(),
      sender: user.username,
      createdAt: new Date().toISOString(),
    };

    await appendMessage(msg);
    setInput("");
    setSending(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    const msg = {
      id: Date.now().toString(),
      type: "image",
      imageUri: asset.uri,
      sender: user.username,
      createdAt: new Date().toISOString(),
    };

    await appendMessage(msg);
  };

  const handleLogout = async () => {
    await clearUser();
    // ❌ JANGAN clearChatHistory di sini
    // Supaya history chat tetap ada walaupun user logout.
    router.replace("/login");
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === user?.username;
    return (
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <Text style={styles.sender}>{item.sender}</Text>
        {item.type === "text" ? (
          <Text style={styles.messageText}>{item.text}</Text>
        ) : (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        )}
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  if (loadingInit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>Chat Sederhana</Text>
          <Text style={styles.subHeader}>Login sebagai: {user?.username}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* List chat */}
      <FlatList
        style={{ flex: 1, marginVertical: 12 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            Belum ada pesan. Mulai chat sekarang.
          </Text>
        }
      />

      {/* Input area (lebih besar & nyaman) */}
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
          <Text style={{ fontSize: 18 }}>📷</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Ketik pesan..."
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            (!input.trim() || sending) && styles.sendButtonDisabled,
          ]}
          disabled={!input.trim() || sending}
        >
          <Text style={styles.sendButtonText}>
            {sending ? "..." : "Kirim"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 8,
    backgroundColor: "#f4f4f4",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#555",
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#ff5555",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 6,
    gap: 6,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
    fontSize: 16,
    maxHeight: 100,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#9e9e9e",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  bubble: {
    maxWidth: "75%",
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  bubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  bubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: "#d1f5d3",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 15,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    color: "#666",
    alignSelf: "flex-end",
  },
  image: {
    width: 190,
    height: 190,
    borderRadius: 8,
    marginTop: 4,
  },
});
