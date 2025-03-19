import React, { useState } from "react";
import {
  View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, CheckBox
} from "react-native";
import { db } from "../utils/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { signUp } from "./authService";
import theme from "../../styles/theme"; 

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [agree, setAgree] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !fname || !lname || !agree) {
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
      <View style={styles.card}>
        <View style={styles.logo} />
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>
          Begin you journey to becoming a Dress-Coder!
        </Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor={theme.colors.text.medium}
          value={fname}
          onChangeText={setFname}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor={theme.colors.text.medium}
          value={lname}
          onChangeText={setLname}
        />
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

        <TouchableOpacity
          style={[styles.registerButton, (!agree || !email || !password || !fname || !lname) && styles.disabledButton]}
          disabled={!agree || !email || !password || !fname || !lname}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.separator} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.neutral.gray,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text.dark,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.medium,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: theme.colors.text.light,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  agreementText: {
    fontSize: 12,
    color: theme.colors.text.medium,
    marginLeft: 5,
  },
  link: {
    color: theme.colors.primary.blue,
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    backgroundColor: theme.colors.buttonBackground.light,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.small,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral.gray,
  },
  registerButtonText: {
    color: theme.colors.text.lightest,
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.text.light,
  },
  orText: {
    marginHorizontal: 10,
    color: theme.colors.text.medium,
    fontWeight: "600",
  },
  googleButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.text.light,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.small,
    alignItems: "center",
  },
  googleButtonText: {
    color: theme.colors.text.dark,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
