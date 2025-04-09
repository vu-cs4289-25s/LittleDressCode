import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../styles/theme";

const ItemContainer = ({
  clothingItem,
  isFavorited,
  toggleFavorite,
  isSelectable = false,
  isSelected = false,
  onSelect = () => {},
  showControls = true,
  isSolo, // if rendering ItemContainer by itself, not in GridLayout
}) => {
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clothingItem) {
      setImageSource(clothingItem);
    }
    setLoading(false);
  }, [clothingItem]);

  return (
    <Pressable onPress={isSelectable ? onSelect : null}>
      <View style={[isSolo ? styles.boxSolo : styles.box]}>
        {/* Top-right icon */}
        {showControls && (
          <View style={styles.iconContainer}>
            {isSelectable ? (
              <MaterialIcons
                name={
                  isSelected ? "radio-button-checked" : "radio-button-unchecked"
                }
                size={24}
                color={
                  isSelected
                    ? theme.colors.accent
                    : theme.colors.accent.lightPink
                }
              />
            ) : (
              <Pressable onPress={toggleFavorite}>
                <MaterialIcons
                  name="favorite"
                  size={24}
                  color={
                    isFavorited
                      ? theme.colors.icons.favorited
                      : theme.colors.icons.default_heart
                  }
                />
              </Pressable>
            )}
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
            onLoad={() => setLoading(false)}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    aspectRatio: 1,
    paddingHorizontal: 17,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgrounds.secondary,
    borderRadius: 10,
  },
  boxSolo: {
    width: 180,
    height:180,
    paddingHorizontal: 17,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgrounds.secondary,
    borderRadius: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 15,
    padding: 4,
  },
  image: {
    width: "75%",
    height: "75%",
    borderRadius: 10,
  },
});

export default ItemContainer;
