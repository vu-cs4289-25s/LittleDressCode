import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import Header from "@/components/headers/Header";
import FilterBar from "@/components/common/FilterBar";
import theme from "@/styles/theme";
import { COLLECTION_FILTERS } from "@/constants/filterPresets";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const CollectionScreen = () => {
  const [collections, setCollections] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);

  const handleSearch = () => {
    // Optional search functionality
  };

  const handleNewOutfit = () => {
    router.push("/outfits?mode=select");
  };

  const isFavorited = (id) => favoritedIds.includes(id);

  const toggleFavorite = async (id) => {
    const isNowFavorite = !isFavorited(id);
    setFavoritedIds((prev) =>
      isNowFavorite ? [...prev, id] : prev.filter((fid) => fid !== id)
    );

    try {
      const docRef = doc(db, "collections", id);
      await updateDoc(docRef, { favorite: isNowFavorite });
      console.log(`⭐ Updated favorite: ${id} → ${isNowFavorite}`);
    } catch (err) {
      console.error("❌ Failed to update favorite:", err);
    }
  };

  const handleFilterChange = (filters) => {
    console.log("🔍 Filters applied:", filters);

    if (filters.length === 0) {
      setCollections(allCollections);
      return;
    }

    const selectedTags = filters.filter((f) => f !== "Favorited");
    const showFavoritedOnly = filters.includes("Favorited");

    const filtered = allCollections.filter((col) => {
      const matchesTags = selectedTags.every((tag) =>
        col.tags?.includes(tag)
      );
      const matchesFavorite = !showFavoritedOnly || col.favorite === true;
      return matchesTags && matchesFavorite;
    });

    setCollections(filtered);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const snapshot = await getDocs(collection(db, "collections"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const favorited = data
          .filter((col) => col.favorite === true)
          .map((col) => col.id);

        setAllCollections(data);
        setCollections(data);
        setFavoritedIds(favorited);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="My Collections"
        onPress={handleNewOutfit}
        handleTextChange={handleSearch}
      />

      <FilterBar
        filters={COLLECTION_FILTERS}
        onFilterChange={handleFilterChange}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {collections.map((col) => (
          <TouchableOpacity
            key={col.id}
            onPress={() => router.push(`/collections/${col.id}`)}
          >
            <View style={styles.collectionSection}>
              <View style={styles.collectionHeader}>
                <Text style={styles.collectionTitle}>{col.name}</Text>
                <Pressable onPress={() => toggleFavorite(col.id)}>
                  <MaterialIcons
                    name="favorite"
                    size={24}
                    color={
                      isFavorited(col.id)
                        ? theme.colors.icons.favorited
                        : theme.colors.icons.default_heart
                    }
                  />
                </Pressable>
              </View>

              <FlatList
                horizontal
                data={col.outfits}
                keyExtractor={(item, index) => `${col.id}-${item}-${index}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.outfitList}
                renderItem={({ item }) => (
                  <View style={styles.outfitItem}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.outfitImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  collectionSection: {
    padding: 16,
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  outfitList: {
    paddingRight: 16,
  },
  outfitItem: {
    marginRight: 12,
    backgroundColor: theme.colors.backgrounds.secondary,
    borderRadius: 12,
    padding: 12,
  },
  outfitImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
});

export default CollectionScreen;
