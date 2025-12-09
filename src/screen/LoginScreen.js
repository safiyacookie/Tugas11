// src/screen/LoginScreen.js
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { saveUser } from "../storage/authStorage";

// Daftar user yang diizinkan (contoh hardcoded)
// Bisa kamu ganti sesuai keinginan
const ALLOWED_USERS = [
  { username: "admin", password: "123456" },
  { username: "user", password: "password" },
];

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    // Cek apakah username & password ada di daftar ALLOWED_USERS
    const found = ALLOWED_USERS.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );

    if (!found) {
      setError("Username atau password salah.");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        username: found.username,
      };

      await saveUser(userData);

      router.replace("/chat");
    } catch (e) {
      console.log("Login error:", e);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login Chat</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator style={{ marginTop: 8 }} />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
