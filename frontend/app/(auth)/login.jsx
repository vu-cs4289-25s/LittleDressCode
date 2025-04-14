import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import theme from "../../styles/theme.js";
import { Stack, useRouter } from "expo-router";
import { signIn } from "./authService";
import { useGoogleSignIn } from "./authService"; // ✅ Import fixed Google Sign-In Hook
import TextField from "@/components/common/Textfield.jsx";
import TextButton from "@/components/common/TextButton.jsx";
import KeyboardDismissWrapper from "@/components/util/KeyboardWrapper.jsx";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { request, promptAsync } = useGoogleSignIn(); // ✅ Use Google Sign-In Hook

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }
    try {
      const user = await signIn(email, password);
      Alert.alert("Success", "Login successful!");
      router.replace("/(main)"); // ✅ Navigate to Main
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!request) {
        Alert.alert("Error", "Google Sign-In is not available.");
        return;
      }
      await promptAsync(); // ✅ Trigger Google Sign-In
    } catch (error) {
      Alert.alert("Google Sign-in Error", error.message);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Login",
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.loginHeader}>
          <View style={styles.logoContainer}>
            <Image
              source={require("./../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Login to your account</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputFields}>
            <TextField
              placeholder="Email"
              size="large"
              onChangeText={setEmail}
            />
            <TextField
              placeholder="Password"
              size="large"
              secure={true}
              onChangeText={setPassword}
            />
          </View>
          <TextButton
            title="Log In"
            size="large"
            color="dark"
            onPress={handleLogin}
          />
          <View style={styles.orSeparator}>
            <View style={styles.separatorLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>
          <TextButton
            title="Sign in with Google"
            size="large"
            color="light"
            onPress={handleGoogleSignIn}
            disabled={!request}
            img={require("../../assets/icons/google.webp")}
          />
        </View>

        <View style={styles.registerLine}>
          <Text>Don’t have an account yet? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLinkText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginHeader: {
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    height: 80,
    width: 210,
    backgroundColor: theme.colors.neutral.gray, // Placeholder color for logo
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text.dark, // More contrast for better readability
    marginBottom: theme.spacing.small,
  },
  orSeparator: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginVertical: theme.spacing.medium,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.icons.light,
  },
  inputFields: {
    width: "100%",
    alignItems: "center",
  },
  orText: {
    marginHorizontal: 10,
    color: theme.colors.text.medium,
    fontWeight: "600",
  },
  inputContainer: {
    width: "85%",
    alignItems: "center",
    marginBottom: theme.spacing.large,
    gap: 20,
  },
  registerLinkText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  registerLine: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});
