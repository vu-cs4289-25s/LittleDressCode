import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
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
import TextButton from "@/components/common/TextButton";

const OutfitScreen = () => {
  const { mode } = useLocalSearchParams();
  const isSelectionMode = mode === "select";
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [outfitData, setOutfitData] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const isFavorited = (id) => favoritedIds.includes(id);

  const toggleFavorite = async (id) => {
    if (!id || typeof id !== "string") {
      console.error("Invalid ID passed to toggleFavorite:", id);
      return;
    }
    const isNowFavorite = !isFavorited(id);
    setFavoritedIds((prev) =>
      isNowFavorite ? [...prev, id] : prev.filter((fid) => fid !== id)
    );

    try {
      await updateOutfitFavoriteStatus(id, isNowFavorite);
    } catch (err) {
      console.error("Failed to update outfit favorite status:", err);
    }
  };

  const handleFilterChange = async (filters) => {
    if (!userId) return;

    try {
      const filtered = await getFilteredOutfits(userId, filters);
      const favorited = filtered
        .filter((item) => item.favorite)
        .map((item) => item.id);

      setFavoritedIds(favorited);
      setOutfitData(filtered.map((item) => ({
        id: String(item.id), // Ensure ID is string
        name: item.name,
        image: { uri: item.imageUrl },
        clothingItems: item.clothingItems,
      })));
    } catch (err) {
      console.error("Error filtering outfits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId && isReady) {
        handleFilterChange([]);
      }
    }, [userId, isReady])
  );

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNewOutfit = () => {
    router.push("outfits/NewOutfit");
  };

  const handleNext = () => {
    router.push({
      pathname: "/collections/NewCollection",
      params: { selected: JSON.stringify(selectedIds) },
    });
  };

  const handleOutfitPress = (item) => {
    if (!isSelectionMode) {
      router.push({
        pathname: "/outfits/[id]",
        params: { 
          id: String(item.id), // Explicit string conversion
          mode: "view"
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {isSelectionMode ? (
        <Header title={"Create a Collection"} backTo={"/collections"} />
      ) : (
        <Header
          title={"My Outfits"}
          onPress={handleNewOutfit}
        />
      )}

      <FilterBar
        filters={OUTFIT_FILTERS}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading your outfits...</Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          <GridLayout
            data={outfitData}
            numColumns={2}
            isSelectable={isSelectionMode}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            isFavorited={isFavorited}
            toggleFavorite={toggleFavorite}
            isOutfit={true}
            onItemPress={handleOutfitPress}
          />
          {isSelectionMode && selectedIds.length > 0 && (
             <TextButton
             title={`Next (${selectedIds.length})`}
             size="large"
             color="dark"
             onPress={handleNext}
           />
           
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OutfitScreen;