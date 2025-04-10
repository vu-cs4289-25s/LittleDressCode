import React from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";


// This component is so the keyboard will not stay present when user isn't typing
const KeyboardDismissWrapper = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;
