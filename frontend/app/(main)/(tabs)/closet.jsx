import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
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
import { auth } from "@/app/utils/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import theme from "@/styles/theme";

const ClosetScreen = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [clothingData, setClothingData] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (!userId) return;

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
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Wait for Firebase to load the user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log("🚫 No user logged in.");
      }
    });

    return unsubscribe;
  }, []);

  // ✅ Fetch clothing items when user is ready
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        handleFilterChange([]);
      }
    }, [userId])
  );

  return (
    <View style={styles.container}>
      <Header
        title="My Closet"
        onPress={() => uploadImage(handleUploadSuccess)}
      />
      <FilterBar
        filters={CLOTHING_FILTERS}
        onFilterChange={handleFilterChange}
        defaultFilters={["Tops", "Pants"]}
      />

      {isLoading ? (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading your closet...</Text>
        </View>
      ) : (
        <GridLayout
          data={clothingData}
          numColumns={2}
          isFavorited={isFavorited}
          toggleFavorite={toggleFavorite}
          onItemPress={(item) => router.push(`/closet/${item.id}`)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    paddingHorizontal: theme.padding.normal,
    paddingBottom: 0,
  },
  loadingText: {
    paddingTop: theme.padding.normal,
    fontSize: 15,
    fontStyle: 'italic'
  }
});

export default ClosetScreen;
