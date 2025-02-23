import { View, Image, StyleSheet, ActivityIndicator } from 'react-native'; 
import theme from "../styles/theme";
import React, { useState, useEffect } from "react";

interface ItemContainerProps {
    clothingItemUrl?: string | null; // Image URL from database, can be null initially
  }

  const ItemContainer: React.FC<ItemContainerProps> = ({ clothingItem }:any) => {
    const [imageSource, setImageSource] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (clothingItem) {
        try {
            setImageSource(clothingItem); 
        } catch (error) {
          console.warn("Error loading image:", error);
          setImageSource(require("../assets/images/shirt.png")); // Fallback image
        }
      } else {
        setImageSource(require("../assets/images/shirt.png")); // Default placeholder
      }
      setLoading(false);
    }, [clothingItem]);
    return (
        <View style={styles.box}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Image source={imageSource} style={styles.image} resizeMode="contain" onLoad={() => setLoading(false)}/>
          )}
        </View>
      );
    };

const styles = StyleSheet.create({
    box: {
        display: "flex",
        width: 173,
        height: 173,
        paddingHorizontal: 17,
        paddingVertical: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.backgrounds.secondary,
        borderRadius: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
      },
});

export default ItemContainer