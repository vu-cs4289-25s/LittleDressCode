import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import GridLayout from "@/components/organization/GridLayout";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import Header from "@/components/headers/Header";
import FilterBar from "@/components/common/FilterBar";
import theme from "@/styles/theme";
import { OUTFIT_FILTERS } from "@/constants/filterPresets";
import { router, useRouter, useLocalSearchParams } from "expo-router";



const OutfitScreen = () => {
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const isSelectionMode = mode === "select";

  const [outfits, setOutfits] = useState([]);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const snapshot = await getDocs(collection(db, "outfits"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOutfits(data);
        setFilteredOutfits(data);

        const favorites = data.filter((item) => item.favorite).map((item) => item.id);
        setFavoritedIds(favorites);
      } catch (error) {
        console.error("Error fetching outfits:", error);
      }
    };

    fetchOutfits();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  };

  const handleSearch = () => {
    // placeholder for future search
  };

  const handleNewOutfit = () => {
    router.push("/outfits/NewOutfit");
  };


  const handleNext = () => {
    router.push({
      pathname: "/collections/NewCollection",
      params: { selected: JSON.stringify(selectedIds) },
    });
  };

  const isFavorited = (id) => favoritedIds.includes(id);

  const toggleFavorite = async (id) => {
    const isNowFavorited = !isFavorited(id);
    setFavoritedIds((prev) =>
      isNowFavorited ? [...prev, id] : prev.filter((f) => f !== id)
    );

    try {
      await updateDoc(doc(db, "outfits", id), {
        favorite: isNowFavorited,
      });
      console.log(`❤️ Outfit ${id} favorite set to ${isNowFavorited}`);
    } catch (err) {
      console.error("Error updating outfit favorite status:", err);
    }
  };

  const handleFilterChange = (filters) => {
    const selectedTags = Object.entries(OUTFIT_FILTERS).reduce((acc, [key, options]) => {
      acc[key] = options.filter((opt) => filters.includes(opt));
      return acc;
    }, {});

    const includeFavorites = filters.includes("Favorited");

    const filtered = outfits.filter((outfit) => {
      const matchesTags = Object.entries(selectedTags).every(([key, values]) =>
        values.length === 0 || values.some((v) => (outfit[key] || []).includes(v))
      );

      const matchesFavorite = includeFavorites ? outfit.favorite === true : true;

      return matchesTags && matchesFavorite;
    });

    setFilteredOutfits(filtered);
  };

  return (
    <View style={styles.container}>
      <Header
        title={isSelectionMode ? "Create a Collection" : "My Outfits"}
        showBackButton={isSelectionMode}
        backTo={isSelectionMode ? "/collections" : null}
        onPress={isSelectionMode ? null : handleNewOutfit}
        handleTextChange={handleSearch}
      />
      <FilterBar filters={OUTFIT_FILTERS} onFilterChange={handleFilterChange} />

      <GridLayout
        data={filteredOutfits}
        numColumns={2}
        isSelectable={isSelectionMode}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        isFavorited={isFavorited}
        toggleFavorite={toggleFavorite}
      />

      {isSelectionMode && selectedIds.length > 0 && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next ({selectedIds.length})</Text>
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
