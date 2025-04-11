import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { auth } from "./utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, View, Text } from "react-native";
import * as Linking from "expo-linking";
import { UserProvider } from "../context/UserContext"; 

const linking = {
  prefixes: ["closetapp://"],
  config: {
    screens: {
      closet: "closet/:id",
      outfits: "outfits/:id",
      collections: "collections/:id",
    },
  },
};

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("🚀 Starting Firebase Auth Check...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        "🔥 Auth State Changed:",
        currentUser ? currentUser.email : "No user logged in"
      );
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        setTimeout(() => {
          console.log("🔄 Redirecting to /login...");
          router.replace("/login");
        }, 100);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading authentication...</Text>
      </View>
    );
  }

  return (
    <UserProvider>
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} linking={linking}>
        {user ? (
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
    </UserProvider>
  );
}
