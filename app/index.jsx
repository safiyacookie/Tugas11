// app/index.jsx
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSavedUser } from "../src/storage/authStorage";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      const user = await getSavedUser();
      setLoggedIn(!!user);
      setReady(true);
    };
    check();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (loggedIn) {
    return <Redirect href="/chat" />;
  }

  return <Redirect href="/login" />;
}
