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
  size = 180,
  isOutfit = false, // If it is an outfit being displayed, 3+ images so styling is different
}) => {
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clothingItem) {
      if (isOutfit && Array.isArray(clothingItem.clothingItems)) {
        const urls = clothingItem.clothingItems.map((item) => item.imageUrl);
        setImageSource(urls); // Now imageSource is just an array of URLs
      } else {
        setImageSource(clothingItem); // For single image
      }
      setLoading(false);
    }
  }, [clothingItem]);

  return (
    <Pressable onPress={onSelect}>
      <View
        style={[
          isSolo
            ? { ...styles.boxSolo, width: size, height: size }
            : styles.box,
        ]}
      >
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
        ) : isOutfit && Array.isArray(imageSource) ? (
          <View style={styles.outfitCircle}>
            {imageSource.map((src, index) => {
              console.log(src);
              return (
                <Image
                  key={index}
                  source={{ uri: src }}
                  style={[styles.outfitImage, outfitImagePositions[index]]}
                  resizeMode="cover"
                />
              );
            })}
          </View>
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
  outfitImage: {
    width: 60,
    height: 60,
    position: "absolute",
    borderColor: "#fff",
  },
});

const outfitImagePositions = [
  { top: 0, left: "50%", transform: [{ translateX: -30 }] },
  { top: "50%", left: 0, transform: [{ translateY: -30 }] },
  { top: "50%", right: 0, transform: [{ translateY: -30 }] },
  { bottom: 0, left: "50%", transform: [{ translateX: -30 }] },
  {
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
];

export default ItemContainer;
