import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import BackButton from "../buttons/BackButton";
import { router } from "expo-router";

const BackHeader = ({ title, backTo = null }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton
          onPress={() => {
            if (backTo) {
              router.replace(backTo); 
            } else {
              router.back();
            }
          }}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
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
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 4,
  },
});

export default BackHeader;
