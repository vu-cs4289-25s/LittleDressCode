import { View, Image, StyleSheet, ActivityIndicator } from 'react-native'; 
import theme from "../styles/theme";
import React, { useState, useEffect } from "react";

interface ItemContainerProps {
  clothingItemUrl?: string | null; // URL of the image to display
}

const ItemContainer: React.FC<ItemContainerProps> = ({ clothingItemUrl }) => {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (clothingItemUrl) {
      setImageSource(clothingItemUrl); // Set the image URL if available
      setLoading(false); // Stop loading after image is set
    } else {
      setLoading(false); // If no image URL, stop loading
    }
  }, [clothingItemUrl]);

  return (
    <View style={styles.box}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        imageSource ? <Image source={{ uri: imageSource }} style={styles.image} /> : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 150, 
    height: 150,
    margin: 10,
    backgroundColor: theme.colors.backgrounds.secondary,
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default ItemContainer;
