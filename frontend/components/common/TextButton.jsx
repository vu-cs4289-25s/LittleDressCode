import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import theme from "../../styles/theme";

/*
  EXAMPLE USAGES:
  import Button from "../../components/common/Button"

    <Button title="Small Button" size="small" color="light" onPress={handlePress} />
    <Button title="Medium Button" size="medium" color="dark" onPress={handlePress} />
    <Button title="Large Button" size="large" color="dark" onPress={handlePress} />
*/
const TextButton = ({
  title,
  onPress,
  size = "medium",
  color = "dark",
  img,
}) => {
  const buttonStyle = [styles.button, styles[size], styles[color]];
  const textStyle = [styles[`${color}Text`]];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      {img ? (
        <View style={styles.imgFormat}>
          <Image source={img} style={styles.img} />
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </View>
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.default,
  },
  small: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.large,
    fontSize: 20,
  },
  medium: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    fontSize: 20,
    width: "200px",
  },
  large: {
    paddingVertical: theme.spacing.large,
    fontSize: 20,
    width: "100%",
  },
  light: {
    backgroundColor: theme.colors.buttonBackground.light,
    color: theme.colors.lightText,
  },
  dark: {
    backgroundColor: theme.colors.buttonBackground.dark,
    color: theme.colors.darkText,
  },
  lightText: {
    color: theme.colors.text.dark,
  },
  darkText: {
    color: theme.colors.text.lightest,
  },
  img: {
    width: 30,
    height: 30,
  },
  imgFormat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TextButton;
