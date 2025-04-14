import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { auth, db } from "../utils/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/providers/google"; // ✅ Only one import

WebBrowser.maybeCompleteAuthSession();

// ✅ Replace with your actual Firebase Web Client ID
const CLIENT_ID =process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

// 🔹 Email/Password Login
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 🔹 Email/Password Registration + Firestore
export const signUp = async (email, password, fname, lname) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details in Firestore
    await setDoc(doc(db, "Users", user.uid), {
      email: user.email,
      firstName: fname,
      lastName: lname,
      photo: "",
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Google Sign-In using Expo Auth Session (Must be used inside a React Component)
export const useGoogleSignIn = () => {
  const router = useRouter();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["profile", "email"],
    },
    { useProxy: true }
  );

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === "success") {
        try {
          const { id_token } = response.authentication;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;

          // ✅ Check if the user already exists in Firestore
          const userRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(userRef);

          if (!docSnap.exists()) {
            await setDoc(userRef, {
              email: user.email,
              firstName: user.displayName || "New User",
              lastName: "",
              photo: user.photoURL || "",
            });
          }

          // ✅ Navigate to Main Screen after sign-in
          router.replace("/(main)");
        } catch (error) {
          console.error("Google sign-in error:", error);
          throw new Error(error.message);
        }
      }
    };

    handleGoogleSignIn();
  }, [response]);

  return { request, promptAsync };
};

// 🔹 Auth State Management Component (Root Component)
export default function RootLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        router.replace("/(auth)/login");
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
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
