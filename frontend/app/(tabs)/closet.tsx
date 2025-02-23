import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; // For navigation
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import ItemContainer from '@/components/ItemContainer';

const ClosetScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Closet page</Text>
      <ItemContainer clothingItemUrl={require("../../assets/images/shirt.png")} />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  icon: {
    marginTop: 30,
  },
});

export default ClosetScreen;