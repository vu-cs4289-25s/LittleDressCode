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
        setImageSource(urls);
      } else {
        setImageSource(clothingItem);
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
          <View style={styles.outfitRow}>
            {imageSource.map((src, index) => {
              const totalImages = imageSource.length;
              const overlapRatio = 0.15; // how much each image overlaps with the previous one
              const effectiveWidth = size * (1 - overlapRatio); // amount of space taken up per image
              const totalWidth =
                size - (totalImages - 1) * effectiveWidth * overlapRatio; // actual available width
              const imageWidth = totalWidth / totalImages;

              return (
                <Image
                  key={index}
                  source={{ uri: src }}
                  style={[
                    styles.outfitImageRow,
                    {
                      width: imageWidth,
                      height: imageWidth,
                      marginLeft: index === 0 ? 0 : -imageWidth * overlapRatio,
                      zIndex: totalImages - index,
                    },
                  ]}
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
    paddingHorizontal: 11,
    paddingVertical: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgrounds.secondary,
    borderRadius: 10,
  },
  boxSolo: {
    paddingHorizontal: 11,
    paddingVertical: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgrounds.secondary,
    borderRadius: 10,
  },
  iconContainer: {
    position: "absolute",
    top: 7,
    right: 7,
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
  outfitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  outfitImageRow: {
  },
});

export default ItemContainer;
