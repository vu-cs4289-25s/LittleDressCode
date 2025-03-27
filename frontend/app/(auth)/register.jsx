import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import { db } from "../utils/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { signUp } from "./authService";
import theme from "../../styles/theme";
import TextField from "@/components/common/Textfield.jsx"; // ✅ Import TextField component
import TextButton from "@/components/common/TextButton.jsx"; // ✅ Import TextButton component

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !fname || !lname) {
      Alert.alert("Error", "Please fill in all fields and agree to terms.");
      return;
    }

    try {
      const user = await signUp(email, password, fname, lname);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(main)"); // ✅ Navigate to Main
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginHeader}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>
          Begin your journey to becoming a Dress-Coder!
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputFields}>
          <TextField
            placeholder="First Name"
            value={fname}
            onChangeText={setFname}
            size="large"
          />
          <TextField
            placeholder="Last Name"
            value={lname}
            onChangeText={setLname}
            size="large"
          />
          <TextField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            size="large"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secure={true}
            size="large"
            secureTextEntry
          />
        </View>

        <TextButton
          title="Register"
          size="large"
          color="dark"
          onPress={handleRegister}
          disabled={!email || !password || !fname || !lname}
        />
      </View>

      <View style={styles.registerLine}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.registerLinkText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loginHeader: {
    marginBottom: 20,
        display:"flex",
    alignItems: "center"
  },
  inputFields: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.neutral.gray,
  },
  title: {
    fontSize: theme.fonts.size.large,
    fontWeight: "bold",
    color: theme.colors.text.dark,
    marginBottom: theme.spacing.large,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.medium,
    textAlign: "center",
    marginBottom: theme.spacing.large,
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
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RegisterScreen;
