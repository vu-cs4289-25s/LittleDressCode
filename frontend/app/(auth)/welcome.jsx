// frontend/app/(auth)/welcome.jsx
import React, { useEffect } from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../styles/theme.js";
import { Stack, useRouter } from "expo-router";

export default function WelcomePage() {
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(main)/(tabs)"); 
    }, 2000); 

    return () => clearTimeout(timer); 
  }, [router]);

  
  const goToMain = () => {
    router.replace("/(main)/(tabs)");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Welcome",
          headerBackTitleVisible: false,
          headerShown: false, // Hide header for welcome screen
        }}
      />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("./../../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.Title}>LittleDressCode</Text>
          <Text style={styles.motto}>Motto/catchphrase of some sort</Text>
        </View>

        {/* ✅ This button manually skips the timer and navigates */}
        <TouchableOpacity style={styles.button} onPress={goToMain}>
          <Text style={styles.buttonText}>Let's get started</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.medium,
  },
  logo: {
    height: 130,
    width: 130,
    borderRadius: theme.borderRadius.default,
    marginBottom: theme.spacing.small,
  },
  Title: {
    fontWeight: "bold",
    color: theme.colors.neutral.gray,
    fontSize: 40,
    textAlign: "center",
  },
  motto: {
    color: theme.colors.text.medium,
    fontSize: 16,
    textAlign: "center",
    marginTop: theme.spacing.small,
  },
  button: {
    backgroundColor: theme.colors.primary.blue,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.borderRadius.small,
  },
  buttonText: {
    color: theme.colors.text.lightest,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

