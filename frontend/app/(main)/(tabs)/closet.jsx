import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GridLayout from '@/components/GridLayout'; // Import the GridLayout component
import Upload from "../../../components/upload";

const ClosetScreen = () => {
  const [clothingData, setClothingData] = useState([]); // Holds images with IDs

  // Handle upload success, assigning a unique incrementing ID
  const handleUploadSuccess = (url) => {
    setClothingData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, image: { uri: url } },
    ]);
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
  
      {/* Grid Layout for clothing data */}
      <GridLayout data={clothingData} numColumns={2} />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16, // Matches the 16px gap
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default ClosetScreen;
