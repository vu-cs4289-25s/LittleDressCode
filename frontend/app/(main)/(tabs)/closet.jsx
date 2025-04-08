import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import GridLayout from "@/components/organization/GridLayout";
import { uploadImage } from "@/app/utils/upload";
import Header from "@/components/headers/Header";
import FilterBar from "@/components/common/FilterBar";
import { useRouter } from "expo-router";
import { getFilteredClothingItems, updateFavoriteStatus } from "@/app/utils/clothingService";

import dummy1 from "../../../assets/images/dummy/clothing/img-1.png";
import dummy2 from "../../../assets/images/dummy/clothing/img-2.png";
import dummy3 from "../../../assets/images/dummy/clothing/img-3.png";
import dummy4 from "../../../assets/images/dummy/clothing/img-4.png";
import dummy5 from "../../../assets/images/dummy/clothing/img-5.png";
import dummy6 from "../../../assets/images/dummy/clothing/img-6.png";
import dummy7 from "../../../assets/images/dummy/clothing/img-7.png";
import dummy8 from "../../../assets/images/dummy/clothing/img-8.png";

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
  const router = useRouter();
  const userId = "testUser123"; // Replace with real user ID

  const [clothingData, setClothingData] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);

  const handleUploadSuccess = (url) => {
    setClothingData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        image: { uri: url },
      },
    ]);

    router.push({
      pathname: "/closet/AddItem",
      params: { imageUrl: url },
    });
  };

  const isFavorited = (id) => favoritedIds.includes(id);

  const toggleFavorite = async (id) => {
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
    console.log("🔍 handleFilterChange triggered with:", filters);
    try {
      const filtered = await getFilteredClothingItems(userId, filters);

      const favorited = filtered
        .filter((item) => item.favorite === true)
        .map((item) => item.id);

      setFavoritedIds(favorited);

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
      } else {
        setClothingData(firebaseData);
      }
    } catch (err) {
      console.error("❌ Error in handleFilterChange:", err);
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
      <FilterBar onFilterChange={handleFilterChange} />
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
