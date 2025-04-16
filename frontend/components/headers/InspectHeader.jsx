import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../styles/theme";
import BackButton from "../buttons/BackButton";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const InspectHeader = ({ backTo = null, isFavorited, toggleFavorite }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.sideContainer}>
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

        <TouchableOpacity onPress={toggleFavorite}>
          <MaterialIcons
            name="favorite"
            size={34}
            color={
              isFavorited
                ? theme.colors.icons.favorited
                : theme.colors.icons.default_heart
            }
          />
        </TouchableOpacity>
      </View>{" "}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.padding.small,
    paddingBottom: 10,
    backgroundColor: theme.colors.backgrounds.secondary,
    paddingHorizontal: theme.padding.normal,
  },
  safeArea: {
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  sideContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InspectHeader;
