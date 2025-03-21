import React, { useState } from "react";
import { Image, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import theme from "../../styles/theme.js";
import { Stack, useRouter } from "expo-router";
import { signIn } from "./authService";
import { useGoogleSignIn } from "./authService"; // ✅ Import fixed Google Sign-In Hook

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
      <Stack.Screen options={{ title: "Login", headerBackTitleVisible: false, headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("./../../assets/images/logo.png")} style={styles.logo} />
        </View>
        <Text style={styles.title}>Let's get started</Text>

        {/* ✅ Google Sign-In Button Fixed */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={!request}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.orSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.text.medium}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.text.medium}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.registerLinkText}> Register</Text>
        </TouchableOpacity>
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
  logoContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.large,
  },
  logo: {
      height: 80,
      width: 80,
      borderRadius: theme.borderRadius.default,
      backgroundColor: theme.colors.neutral.gray, // Placeholder color for logo
      justifyContent: "center",
      alignItems: "center",
  },
  title: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text.dark, // More contrast for better readability
      marginBottom: theme.spacing.large,
  },
  googleButton: {
      backgroundColor: theme.colors.neutral.gray,
      paddingVertical: theme.spacing.medium,
      borderRadius: theme.borderRadius.small,
      alignItems: "center",
      width: "85%",
      marginBottom: theme.spacing.medium,
      borderWidth: 1,
      borderColor: theme.colors.icons.light,
  },
  googleButtonText: {
      color: theme.colors.text.dark,
      fontSize: 16,
      fontWeight: "600",
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
  orText: {
      marginHorizontal: 10,
      color: theme.colors.text.medium,
      fontWeight: "600",
  },
  inputContainer: {
      width: "85%",
      marginBottom: theme.spacing.large,
  },
  input: {
      backgroundColor: theme.colors.backgrounds.secondary,
      borderWidth: 1,
      borderColor: theme.colors.icons.light,
      borderRadius: theme.borderRadius.small,
      paddingVertical: theme.spacing.medium,
      paddingHorizontal: theme.spacing.large,
      marginBottom: theme.spacing.medium,
      fontSize: 16,
      color: theme.colors.text.dark,
  },
  loginButton: {
      backgroundColor: theme.colors.primary.pink,
      paddingVertical: theme.spacing.medium,
      borderRadius: theme.borderRadius.small,
      alignItems: "center",
      width: "85%",
      marginBottom: theme.spacing.medium,
  },
  loginButtonText: {
      color: theme.colors.text.lightest,
      fontSize: 16,
      fontWeight: "bold",
  },
  registerLinkText: {
      marginTop: theme.spacing.medium,
      color: theme.colors.primary.blue,
      fontSize: 16,
      fontWeight: "bold",
  },
});
