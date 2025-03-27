import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import backArrow from "../../assets/images/backArrow.png";

const BackButton = ({ to = null }) => {
  const handlePress = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Image source={backArrow} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#181c25",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});

export default BackButton;
