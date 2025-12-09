// src/storage/authStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "chat_user";

export async function saveUser(user) {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (e) {
    console.log("saveUser error:", e);
  }
}

export async function getSavedUser() {
  try {
    const json = await AsyncStorage.getItem(AUTH_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.log("getSavedUser error:", e);
    return null;
  }
}

export async function clearUser() {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.log("clearUser error:", e);
  }
}
