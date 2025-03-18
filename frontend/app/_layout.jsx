import { Stack } from "expo-router/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import { auth } from "./utils/firebaseConfig"; 
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthCheck = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Checking Firebase Auth State...");

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase Auth State Changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }
  console.log("THIS IS THE USER", user)

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
      {!user ? ( 
  <>

    <Stack.Screen name="welcome" options={{ headerShown: false }} />
    <Stack.Screen name="login" options={{ headerShown: false }} />
    <Stack.Screen name="register" options={{ headerShown: false }} />
    
  </>
) : (
  <Stack.Screen name="(main)/(tabs)" options={{ headerShown: false }} />
)}
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
  
};

export default function RootLayout() {
  return <AuthCheck />;
}
