import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { registerUser } from "../utils/authService"; 
import { CreateUserWithEmailAndPassword} from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
// can add toast message if we want later

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        await CreateUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        console.log(user);
        if (user) {
            await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: fname,
            lastName: lname,
            photo:""
        });
        }   
    } catch (error) {
        console.log(error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Create an Account</Text>
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
