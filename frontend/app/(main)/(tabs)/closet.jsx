import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Upload from "../../../components/upload"; 
import ItemContainer from '@/components/ItemContainer';

const ClosetScreen = () => {
  const [imageUrls, setImageUrls] = useState([]); // Array to hold multiple image URLs

  // Handle upload success
  const handleUploadSuccess = (url) => {
    setImageUrls((prevUrls) => [...prevUrls, url]); // Add the new image URL to the array
  };

  return (
    <View style={styles.container}>
      {/* Header with Upload button */}
      <View style={styles.header}>
        <Text style={styles.title}>My Closet</Text>
        <View style={styles.uploadButtonContainer}>
          <Upload onUploadSuccess={handleUploadSuccess} />
        </View>
      </View>

      {/* Render multiple ItemContainers */}
      <ScrollView contentContainerStyle={styles.closetContainer}>
        {imageUrls.map((url, index) => (
          <ItemContainer key={index} clothingItemUrl={url} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadButtonContainer: {
    marginRight: 8, // Adjust spacing as needed
  },
  closetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 16,
  },
});

export default ClosetScreen;
