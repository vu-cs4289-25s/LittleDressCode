import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import theme from "../../styles/theme";

/*
  EXAMPLE USAGE:
  import TextField from "../../components/common/TextField"

    <TextField placeholder="Enter text" onChangeText={handleTextChange} />
*/

const TextField = ({ placeholder, onChangeText }) => {
  const inputStyle = [styles.input];

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.text.light}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: theme.spacing.large,
  },
  input: {
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    fontSize: 18,
    borderRadius: theme.borderRadius.small,
    borderColor: theme.colors.neutral.gray,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
});

export default TextField;
