import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { auth } from "./utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, View, Text } from "react-native";

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("🚀 Starting Firebase Auth Check...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔥 Auth State Changed:", currentUser ? currentUser.email : "No user logged in");
      setUser(currentUser);
      setLoading(false);
      
      // Delay navigation to avoid early navigation error
      if (!currentUser) {
        setTimeout(() => {
          console.log("🔄 Forcing navigation to /login...");
          router.replace("/login"); // Ensure this is a valid route
        }, 100); // Small delay ensures navigation system is ready
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
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
