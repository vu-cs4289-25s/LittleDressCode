import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "@/context/UserContext";
import { db } from "@/app/utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import StyleHeader from "../../../components/headers/BackHeader";
import TextButton from "@/components/common/TextButton";

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
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <StyleHeader title={"Settings"} />
      </View>
      <View style={styles.containerMain}>
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

        <TextButton title="Save Changes" size="large" color="dark" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 32,
    gap: 20,
  },
  containerMain: {
    backgroundColor: "white",
    padding: 32,
    gap: 20,
  },

  bigContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 80,
    position: "relative",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
  },
});
