import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import theme from "../../styles/theme";

const TextButton = ({
  title,
  onPress,
  size = "medium",
  color = "dark",
  img,
}) => {
  const buttonStyle = [
    styles.button,
    styles[size],
    styles[`${color}Background`] // Apply only background color here
  ];

  const textStyle = [
    styles.buttonText,
    styles[`${color}Text`]       // Apply only text color here
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      {img ? (
        <View style={styles.imgFormat}>
          <Image source={img} style={styles.img} />
          <Text style={textStyle}>{title}</Text>
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
  },
  medium: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    width: "200px",
  },
  large: {
    paddingVertical: theme.spacing.large,
    width: "100%",
  },
  lightBackground: {
    backgroundColor: theme.colors.buttonBackground.light,
  },
  darkBackground: {
    backgroundColor: theme.colors.buttonBackground.dark,
  },
  lightText: {
    color: theme.colors.text.dark,
  },
  darkText: {
    color: theme.colors.text.lightest,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
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
});

export default TextButton;
