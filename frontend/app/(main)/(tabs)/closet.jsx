import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import GridLayout from "../../../components/organization/GridLayout"; // Import the GridLayout component
import { uploadImage } from "../../utils/upload";
import Header from "@/components/Header";
import dummy1 from "../../../assets/images/dummy/img-1.png";
import dummy2 from "../../../assets/images/dummy/img-2.png";
import dummy3 from "../../../assets/images/dummy/img-3.png";
import dummy4 from "../../../assets/images/dummy/img-4.png";
import dummy5 from "../../../assets/images/dummy/img-5.png";
import dummy6 from "../../../assets/images/dummy/img-6.png";
import dummy7 from "../../../assets/images/dummy/img-7.png";
import dummy8 from "../../../assets/images/dummy/img-8.png";

const dummyStartData = [
  dummy1,
  dummy2,
  dummy3,
  dummy4,
  dummy5,
  dummy6,
  dummy7,
  dummy8,
];

const ClosetScreen = () => {
  // Initializing with dummy data for now
  const [clothingData, setClothingData] = useState(
    dummyStartData.map((image, index) => ({
      id: index + 1, 
      image: image, 
    }))
  ); 

  // Handle upload success, assigning a unique incrementing ID
  const handleUploadSuccess = (url) => {
    setClothingData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, image: { uri: url } },
    ]);
  };

  const handleSearch = () => {
    // When a user is typing in the search bar
  };

  return (
    <View style={styles.container}>
      <Header
        title={"My Closet"}
        onPress={() => uploadImage(handleUploadSuccess)}
        handleTextChange={handleSearch}
      />
      <GridLayout data={clothingData} numColumns={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16, // Matches the 16px gap
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default ClosetScreen;
