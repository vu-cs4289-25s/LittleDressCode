import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "@/styles/theme";
import AddButton from "../buttons/AddButton";
import TextField from "../common/Textfield";
import BackButton from "../common/BackButton";

const Header = ({
  title,
  onPress,
  handleTextChange,
  showBackButton = false,
  backTo = null,
  showSearch = true,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.titleRow}>
            {showBackButton && <BackButton to={backTo} />}
            <Text style={styles.title}>{title}</Text>
          </View>
          {onPress && <AddButton onPress={onPress} />}
        </View>

        {showSearch && (
          <TextField
            icon={"search"}
            placeholder="Search items"
            size="large"
            onChangeText={handleTextChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
  },
  container: {
    padding: 10,
    gap: 8,
  },
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    paddingLeft: 4,
  },
});

export default Header;
