// src/storage/chatStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_KEY = "chat_history";

export async function saveChatHistory(messages) {
  try {
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.log("saveChatHistory error:", e);
  }
}

export async function loadChatHistory() {
  try {
    const json = await AsyncStorage.getItem(CHAT_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.log("loadChatHistory error:", e);
    return [];
  }
}

export async function clearChatHistory() {
  try {
    await AsyncStorage.removeItem(CHAT_KEY);
  } catch (e) {
    console.log("clearChatHistory error:", e);
  }
}
