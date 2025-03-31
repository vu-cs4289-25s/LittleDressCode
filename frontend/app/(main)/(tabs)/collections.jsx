import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AccordionView from "@/components/AccordionView";
import theme from "@/styles/theme";
import Header from "@/components/headers/Header";
import GridLayout from "@/components/organization/GridLayout";
import { router } from "expo-router";
import dummy1 from "@/assets/images/dummy/outfits/img-1.png";
import dummy2 from "@/assets/images/dummy/outfits/img-2.png";
import dummy3 from "@/assets/images/dummy/outfits/img-3.png";
import dummy4 from "@/assets/images/dummy/outfits/img-4.png";
import dummy5 from "@/assets/images/dummy/outfits/img-5.png";
import dummy6 from "@/assets/images/dummy/outfits/img-6.png";

const dummyStartData = [dummy1, dummy2, dummy3, dummy4, dummy5, dummy6];

const CollectionScreen = () => {
  const [clothingData, setClothingData] = useState(
    dummyStartData.map((image, index) => ({
      id: index + 1,
      image: image,
    }))
  );

  const handleSearch = () => {
    // search functionality
  };

  const handleNewOutfit = () => {
    router.push("/outfits?mode=select");
  };

  return (
    <View style={styles.container}>
      <Header
        title={"My Collections"}
        onPress={handleNewOutfit}
        handleTextChange={handleSearch}
      />
      <GridLayout data={clothingData} numColumns={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    paddingHorizontal: 16,
  },
});

export default CollectionScreen;
