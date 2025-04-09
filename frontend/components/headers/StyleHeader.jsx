import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import BackButton from "../buttons/BackButton";
import { router } from "expo-router"; 

const StyleHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={() => router.back()} />
      </View>
      <Text style={styles.title}>Styling</Text>
      <View style={styles.backButtonContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    paddingTop: Platform.OS === "web" ? 20 : 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButtonContainer: {
    width: 40, 
  },
  title: {
    fontSize: theme.fonts.size.large,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1, 
  },
});



export default StyleHeader;
