import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import theme from "../../styles/theme";
import { MaterialIcons } from "@expo/vector-icons";

/*
  EXAMPLE USAGE:
  import TextField from "../../components/common/TextField"

  Icon:
  //import icon library
    <TextField
      icon="search"
      placeholder="Search items"
      size="medium"
      onChangeText={handleTextChange}
    />;

  No icon:
    <TextField
      placeholder="Search items"
      size="medium"
      onChangeText={handleTextChange}
    />;
*/

const TextField = ({ icon, placeholder, size = "large", onChangeText, secure = false  }) => {
  const inputStyle = [styles.input, styles[size]];

  return (
    <View style={styles.container}>
      {icon && (
        <MaterialIcons
          name={icon}
          size={18}
          color={theme.colors.text.light}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[inputStyle, icon ? { paddingLeft: 45 } : {}]}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.text.light}
        secureTextEntry={secure}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.small,
  },
  small: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.large,
  },
  medium: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    width: "100%",
  },
  large: {
    paddingVertical: theme.spacing.large,
    width: "100%",
  },
  icon: {
    position: "absolute",
    left: theme.spacing.large,
    zIndex: 10,
  },
  input: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
    fontSize: 18,
    borderRadius: theme.borderRadius.small,
    borderColor: theme.colors.neutral.gray,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
});

export default TextField;
