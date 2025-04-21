import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "../buttons/AddButton";
import TextField from "../common/Textfield";
import theme from "@/styles/theme";

const Header = ({
  title,
  onPress,
  handleTextChange,
  showSearch = true,
}) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.titleRow}>
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
    gap: 8,
    paddingTop: theme.padding.small,
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
    fontSize: 22,
    fontWeight: "600",
    paddingLeft: 4,
  },
});

export default Header;
