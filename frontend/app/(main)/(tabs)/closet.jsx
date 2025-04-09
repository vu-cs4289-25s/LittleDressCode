import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import GridLayout from "@/components/organization/GridLayout";
import { uploadImage } from "@/app/utils/upload";
import Header from "@/components/headers/Header";
import FilterBar from "@/components/common/FilterBar";
import { useRouter } from "expo-router";
import { CLOTHING_FILTERS } from "@/constants/filterPresets";
import {
  getFilteredClothingItems,
  updateFavoriteStatus,
} from "@/app/utils/clothingService";

const ClosetScreen = () => {
  const router = useRouter();
  const userId = "testUser123"; // Replace with real user ID

  const [clothingData, setClothingData] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);

  const handleUploadSuccess = (url) => {
    router.push({
      pathname: "/closet/AddItem",
      params: { imageUrl: url },
    });
  };

  const isFavorited = (id) => favoritedIds.includes(id);

  const toggleFavorite = async (id) => {
    if (!id || typeof id !== "string") {
      console.error("🚨 Invalid ID passed to toggleFavorite:", id);
      return;
    }
    const isNowFavorite = !isFavorited(id);
    setFavoritedIds((prev) =>
      isNowFavorite ? [...prev, id] : prev.filter((fid) => fid !== id)
    );

    try {
      await updateFavoriteStatus(id, isNowFavorite);
      console.log(`💖 Favorite updated: ${id} -> ${isNowFavorite}`);
    } catch (err) {
      console.error("❌ Failed to update favorite status:", err);
    }
  };

  const handleFilterChange = async (filters) => {
    console.log("🔍 Filters applied:", filters);
    try {
      const filtered = await getFilteredClothingItems(userId, filters);

      const favorited = filtered
        .filter((item) => item.favorite)
        .map((item) => item.id);

      setFavoritedIds(favorited);

      const firebaseData = filtered.map((item, index) => ({
        id: item.id || `firebase-${index}`,
        name: item.name,
        image: { uri: item.imageUrl },
      }));

      setClothingData(firebaseData);
    } catch (err) {
      console.error("❌ Error filtering clothing items:", err);
    }
  };

  useEffect(() => {
    handleFilterChange([]);
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="My Closet"
        onPress={() => uploadImage(handleUploadSuccess)}
      />
      <FilterBar filters={CLOTHING_FILTERS} onFilterChange={handleFilterChange} />
      <GridLayout
        data={clothingData}
        numColumns={2}
        isFavorited={isFavorited}
        toggleFavorite={toggleFavorite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
});

export default ClosetScreen;
