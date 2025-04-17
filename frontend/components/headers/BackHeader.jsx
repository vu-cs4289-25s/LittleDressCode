import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../styles/theme";
import BackButton from "../buttons/BackButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const BackHeader = ({ title, backTo = null, noPadding = false }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View
        style={[
          styles.container,
          noPadding && {
            paddingHorizontal: 0, 
          },
        ]}
      >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.padding.small,
    paddingBottom: 10,
    paddingHorizontal: theme.padding.normal,
  },
  backButtonContainer: {
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    paddingLeft: 4,
  },
});

export default BackHeader;
