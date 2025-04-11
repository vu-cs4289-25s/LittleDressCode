import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "@/context/UserContext";
import { db } from "@/app/utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";


export default function SettingsScreen() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [password, setPassword] = useState(""); // Optional: Firebase auth password update needs special handling
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        firstName,
        lastName,
        email,
        mobile,
        notificationsEnabled,
      });
      Alert.alert("Success", "Settings updated!");
      router.back();
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to update settings.");
    }
  };

  return (
    
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
            </TouchableOpacity>
        </View>

      <Text style={styles.title}>Settings</Text>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <MaterialIcons name="edit" size={20} color="#333" />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={lastName}
          onChangeText={setLastName}
        />
        <MaterialIcons name="edit" size={20} color="#333" />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={firstName + lastName}
          editable={false}
        />
        <MaterialIcons name="edit" size={20} color="#999" />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <MaterialIcons name="edit" size={20} color="#333" />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
        />
        <MaterialIcons name="edit" size={20} color="#333" />
      </View>

      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
        />
        <MaterialIcons name="edit" size={20} color="#333" />
      </View>

    
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Enable / Disable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 10,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#999",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
});
