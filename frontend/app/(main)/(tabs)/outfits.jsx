import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import GridLayout from "../../../components/organization/GridLayout"; // Import the GridLayout component
import { uploadImage } from "../../utils/upload";
import { Link, router } from "expo-router"; // For navigation
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import Header from "@/components/Header";
import dummy1 from "../../../assets/images/dummy/outfits/img-1.png";
import dummy2 from "../../../assets/images/dummy/outfits/img-2.png";
import dummy3 from "../../../assets/images/dummy/outfits/img-3.png";
import dummy4 from "../../../assets/images/dummy/outfits/img-4.png";
import dummy5 from "../../../assets/images/dummy/outfits/img-5.png";
import dummy6 from "../../../assets/images/dummy/outfits/img-6.png";

const dummyStartData = [
  dummy1,
  dummy2,
  dummy3,
  dummy4,
  dummy5,
  dummy6,
];
const OutfitScreen = () => {
   // Initializing with dummy data for now
    const [clothingData, setClothingData] = useState(
      dummyStartData.map((image, index) => ({
        id: index + 1, 
        image: image, 
      }))
    ); 

  const handleSearch = () => {
    // When a user is typing in the search bar
  };

  const handleNewOutfit = () => {
    router.push('/NewOutfit')
  }


  return (
    <View style={styles.container}>
      <Header
        title={"My Outfits"}
        onPress={handleNewOutfit}
        handleTextChange={handleSearch}
        link={"/outfits/NewOutfit"}
      />
      <GridLayout data={clothingData} numColumns={2} />

    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    gap: 10,
  },
  icon: {
    marginTop: 30,
  },
});

export default OutfitScreen;
