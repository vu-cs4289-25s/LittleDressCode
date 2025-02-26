import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GridLayout from '@/components/GridLayout'; // Import the GridLayout component

const ClosetScreen = () => {
  // Sample clothing data (replace with actual data from your database)
  const clothingData = [
    { id: "1", image: require("../../../assets/images/shirt.png") },
    { id: "2", image: require("../../../assets/images/shirt.png") },
    { id: "3", image: require("../../../assets/images/shirt.png") },
    { id: "4", image: require("../../../assets/images/shirt.png") },
    { id: "5", image: require("../../../assets/images/shirt.png") },
    { id: "6", image: require("../../../assets/images/shirt.png") },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Closet</Text>
      <GridLayout data={clothingData} numColumns={2} />
    </View>
  );
};

// Styles for the component
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
