import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/app/utils/firebaseConfig";
import { UserContext } from "@/context/UserContext";

const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { label: "Personal Details", onPress: () => router.push("/(main)/profile/Settings") },
    { label: "Settings", onPress: () => router.push("/(main)/profile/Settings") },
    { label: "Help and Support", onPress: () => {} },
    { label: "Logout", onPress: handleLogout },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            user?.photo
              ? { uri: user.photo }
              : require("@/assets/images/avatar-placeholder.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.firstName || "User"}</Text>
      </View>

      <View style={styles.actions}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={item.onPress}
          >
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  username: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: "600",
  },
  actions: {
    gap: 12,
  },
  button: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileScreen;
