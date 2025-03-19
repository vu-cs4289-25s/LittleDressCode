import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import GridLayout from "../../../components/organization/GridLayout";
import { uploadImage } from "../../utils/upload";
import Header from "@/components/Header";
import dummy1 from "../../../assets/images/dummy/clothing/img-1.png";
import dummy2 from "../../../assets/images/dummy/clothing/img-2.png";
import dummy3 from "../../../assets/images/dummy/clothing/img-3.png";
import dummy4 from "../../../assets/images/dummy/clothing/img-4.png";
import dummy5 from "../../../assets/images/dummy/clothing/img-5.png";
import dummy6 from "../../../assets/images/dummy/clothing/img-6.png";
import dummy7 from "../../../assets/images/dummy/clothing/img-7.png";
import dummy8 from "../../../assets/images/dummy/clothing/img-8.png";
import { useRouter } from "expo-router"; 

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
  const router = useRouter(); // Initialize the router
  const [clothingData, setClothingData] = useState(
    dummyStartData.map((image, index) => ({
      id: index + 1,
      image: image,
    }))
  );

  const handleUploadSuccess = (url) => {
    setClothingData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, image: { uri: url } },
    ]);


    // Need to add remove Background here, temporary hosting?
    // Navigate to the AddItem screen with the image URL as a parameter
    router.push({
      pathname: "/closet/AddItem",
      params: { imageUrl: url },
    });
  };

  const handleSearch = () => {
    // Handle search functionality
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default ClosetScreen;