import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Link } from "expo-router"; // For navigation
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import Header from "@/components/Header";

const OutfitScreen = () => {
  const handleSearch = () => {
    // When a user is typing in the search bar
  };

  return (
    <View style={styles.container}>
      <Header
        title={"My Outfits"}
        // onPress={}
        handleTextChange={handleSearch}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  icon: {
    marginTop: 30,
  },
});

export default OutfitScreen;
