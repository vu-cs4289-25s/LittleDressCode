import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { auth, db } from "../utils/firebaseConfig";
import { 
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword 
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

// 🔹 Authentication State Management
export default function RootLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 Checking Firebase Auth...");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔥 Auth state changed:", currentUser ? currentUser.email : "No user logged in");
      setUser(currentUser);
      setLoading(false);

      // 🔹 Redirect to login if not authenticated
      if (!currentUser) {
        console.log("🔄 Redirecting to login...");
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

// 🔹 Sign In with Email & Password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 🔹 Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userRef = doc(db, "Users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Save new Google user to Firestore
      await setDoc(userRef, {
        email: user.email,
        firstName: user.displayName || "New User",
        lastName: "",
        photo: user.photoURL || "",
      });
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 🔹 Sign Up & Save User to Firestore
export const signUp = async (email, password, fname, lname) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details to Firestore
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
