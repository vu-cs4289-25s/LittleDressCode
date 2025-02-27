import { View, Image, StyleSheet, ActivityIndicator, Pressable } from 'react-native'; 
import theme from "../styles/theme";
import React, { useState, useEffect } from "react";
import {MaterialIcons} from "@expo/vector-icons";

const ItemContainer = ({ clothingItem, isFavorited, toggleFavorite }) => {
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clothingItem) {
      setImageSource(clothingItem); 
    }
    setLoading(false);
  }, [clothingItem]);
  
    return (
        <View style={styles.box}>
           <Pressable style={styles.iconContainer} onPress={toggleFavorite}>
                <MaterialIcons name={"favorite"} 
                    size={24} 
                    color={isFavorited ? theme.colors.icons.favorited : theme.colors.icons.default_heart} />
            </Pressable>
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
