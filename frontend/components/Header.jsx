import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import theme from "../styles/theme";
import AddButton from "./common/AddButton";
import TextField from "./common/Textfield";

const Header = ({ title, onPress, handleTextChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>{title}</Text>
        <AddButton onPress={onPress} />
      </View>
      <TextField
        icon={"search"}
        placeholder="Search items"
        size="large"
        onChangeText={handleTextChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? 16 : 50,
  },
  container: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default Header;
