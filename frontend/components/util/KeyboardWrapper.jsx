import React from "react";
import { Pressable, Keyboard, View } from "react-native";

const KeyboardDismissWrapper = ({ children }) => {
  return (
    <Pressable
      onPress={Keyboard.dismiss}
      style={{ flex: 1 }}
    >
      {({ pressed }) => (
        <View style={{ flex: 1, opacity: pressed ? 0.99 : 1 }}>
          {children}
        </View>
      )}
    </Pressable>
  );
};

export default KeyboardDismissWrapper;
