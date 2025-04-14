import React from "react";
import {TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";

const AddButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="arrow-back" style={styles.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 25,
    backgroundColor: theme.colors.buttonBackground.dark,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.backgrounds.primary,
    fontSize: 24,
  },
});

export default AddButton;
