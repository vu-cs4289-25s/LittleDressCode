import React, { useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import GridLayout from "../../../components/organization/GridLayout";
import { router, useRouter, useLocalSearchParams } from "expo-router";
import theme from "@/styles/theme";
import FilterBar from "@/components/common/FilterBar";
// Dummy outfit images
import Header from "@/components/headers/Header";
import dummy1 from "../../../assets/images/dummy/outfits/img-1.png";
import dummy2 from "../../../assets/images/dummy/outfits/img-2.png";
import dummy3 from "../../../assets/images/dummy/outfits/img-3.png";
import dummy4 from "../../../assets/images/dummy/outfits/img-4.png";
import dummy5 from "../../../assets/images/dummy/outfits/img-5.png";
import dummy6 from "../../../assets/images/dummy/outfits/img-6.png";
import BackHeader from "@/components/headers/BackHeader";

const dummyStartData = [dummy1, dummy2, dummy3, dummy4, dummy5, dummy6];

const OutfitScreen = () => {
  const { mode } = useLocalSearchParams();
  const router = useRouter(); // Get the router object from expo-router
  const isSelectionMode = mode === "select";

  const handleFilterChange = async (filters) => {
    console.log("🔍 handleFilterChange triggered with:", filters);

    try {
      console.log("📞 About to call getFilteredClothingItems");
      const filtered = await getFilteredClothingItems(userId, filters);

      const firebaseData = filtered.map((item, index) => ({
        id: item.id || `firebase-${index}`,
        name: item.name,
        image: { uri: item.imageUrl },
      }));

      if (filters.length === 0) {
        const combined = [
          ...dummyStartData.map((img, i) => ({
            id: i + 1,
            name: `[dummy ${i + 1}]`,
            image: img,
          })),
          ...firebaseData,
        ];
        setClothingData(combined);
        console.log(
          "🧺 Items on screen (no filters):",
          combined.map((item) => item.name)
        );
      } else {
        console.log("🧪 Entered filtered branch");
        setClothingData(firebaseData);
        console.log(
          "🎯 Items on screen (filtered):",
          firebaseData.map((item) => item.name)
        );
      }
    } catch (err) {
      console.error("❌ Error in handleFilterChange:", err);
    }
  };

  const [clothingData, setClothingData] = useState(
    dummyStartData.map((image, index) => ({
      id: index + 1,
      image: image,
    }))
  );

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    // Add search logic here if needed
  };

  const handleNewOutfit = () => {
    router.push("outfits/NewOutfit"); // Correct placement of router.push inside the function
  };

  const handleNext = () => {
    router.push({
      pathname: "/collections/NewCollection",
      params: { selected: JSON.stringify(selectedIds) },
    });
  };

  return (
    <View style={styles.container}>
      {isSelectionMode ? (
        <BackHeader title={"Create a Collection"} backTo={"/collections"} />
      ) : (
        <Header
          title={"My Outfits"}
          onPress={handleNewOutfit}
          handleTextChange={handleSearch}
        />
      )}

      <FilterBar onFilterChange={handleFilterChange} />

      <GridLayout
        data={clothingData}
        numColumns={2}
        isSelectable={isSelectionMode}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        isFavorited={(id) => false} // Replace with real logic later
        toggleFavorite={() => {}} // Optional for now
      />

      {isSelectionMode && selectedIds.length > 0 && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              Next ({selectedIds.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  nextButtonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OutfitScreen;
