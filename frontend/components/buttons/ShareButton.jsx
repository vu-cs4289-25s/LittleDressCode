import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useShare } from "@/hooks/useShare";

const ShareButton = ({
  type,
  id,
  refToCapture = null,
  label = null,
  size = 24,
  color = "black",
}) => {
  const { shareItem } = useShare();

  const handlePress = () => {
    shareItem({ type, id, refToCapture });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <MaterialIcons name="share" size={size} color={color} />
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default ShareButton;
