import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import GridLayout from "../../../components/organization/GridLayout";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "@/styles/theme";
import { useFocusEffect } from "@react-navigation/native";
import FilterBar from "@/components/common/FilterBar";
import { OUTFIT_FILTERS } from "@/constants/filterPresets";
import {
  getFilteredOutfits,
  updateOutfitFavoriteStatus,
} from "@/app/utils/outfitService";
import Header from "@/components/headers/Header";
import { useCallback } from "react";
import { auth } from "@/app/utils/firebaseConfig";

const OutfitScreen = () => {
  const { mode } = useLocalSearchParams();
  const isSelectionMode = mode === "select";
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [outfitData, setOutfitData] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      await updateOutfitFavoriteStatus(id, isNowFavorite);
      console.log(`💖 Favorite updated: ${id} -> ${isNowFavorite}`);
    } catch (err) {
      console.error("❌ Failed to update outfit favorite status:", err);
    }
  };

  const handleFilterChange = async (filters) => {
    if (!userId) return;

    console.log("🔍 Outfit filters applied:", filters);
    try {
      const filtered = await getFilteredOutfits(userId, filters);

      const favorited = filtered
        .filter((item) => item.favorite)
        .map((item) => item.id);

      setFavoritedIds(favorited);

      const firebaseData = filtered.map((item, index) => ({
        id: item.id || `firebase-${index}`,
        name: item.name,
        image: { uri: item.imageUrl },
        clothingItems: item.clothingItems,
      }));

      setOutfitData(firebaseData);
    } catch (err) {
      console.error("❌ Error filtering outfits:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        handleFilterChange([]);
      }
    }, [userId])
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

      <FilterBar
        filters={OUTFIT_FILTERS}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <View style={styles.container}>
          <Text>Loading your outfits...</Text>
        </View>
      ) : (
        <View>
          <GridLayout
            data={outfitData}
            numColumns={2}
            isSelectable={isSelectionMode}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            isFavorited={isFavorited}
            toggleFavorite={toggleFavorite}
            isOutfit={true}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 0,
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
