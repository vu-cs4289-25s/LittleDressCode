import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  getDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/app/utils/firebaseConfig";
import Header from "@/components/headers/Header";
import FilterBar from "@/components/common/FilterBar";
import theme from "@/styles/theme";
import { COLLECTION_FILTERS } from "@/constants/filterPresets";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ItemContainer from "@/components/organization/ItemContainer";

const CollectionScreen = () => {
  const [collections, setCollections] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log(` Updated favorite: ${id} → ${isNowFavorite}`);
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  const handleFilterChange = (filters = []) => {
    if (!Array.isArray(filters) || filters.length === 0) {
      setCollections(allCollections);
      return;
    }

    const selectedTags = filters.filter((f) => f !== "Favorited");
    const showFavoritedOnly = filters.includes("Favorited");

    const filtered = allCollections.filter((col) => {
      const tags = Array.isArray(col.category) ? col.category : [];
      const matchesTags = selectedTags.every((tag) => tags.includes(tag));
      const matchesFavorite = !showFavoritedOnly || col.favorite === true;
      return matchesTags && matchesFavorite;
    });

    setCollections(filtered);
  };

  // ✅ Wait for user login state before fetching collections
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchCollections = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "collections"));
        const data = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const rawData = docSnap.data();
            const outfitIds = Array.isArray(rawData.outfits)
              ? rawData.outfits
              : [];

            const outfits = await Promise.all(
              outfitIds.map(async (outfitId) => {
                const outfitSnap = await getDoc(doc(db, "outfits", outfitId));
                return outfitSnap.exists()
                  ? { id: outfitId, ...outfitSnap.data() }
                  : null;
              })
            );

            return {
              id: docSnap.id,
              ...rawData,
              outfits: outfits.filter(Boolean),
            };
          })
        );

        const favorited = data
          .filter((col) => col.favorite === true)
          .map((col) => col.id);

        setAllCollections(data);
        setCollections(data);
        setFavoritedIds(favorited);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user]);

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

      {loading ? (
        <Text>Loading collections...</Text>
      ) : (
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
                  keyExtractor={(item, index) =>
                    `${col.id}-${item?.id ?? index}`
                  }
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.outfitList}
                  renderItem={({ item }) => (
                    <View style={styles.outfitItem}>
                      <ItemContainer
                        clothingItem={item}
                        isFavorited={false}
                        toggleFavorite={() => {}}
                        isSelectable={false}
                        isSelected={false}
                        showControls={false}
                        isOutfit={true}
                        size={150}
                      />
                    </View>
                  )}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    padding: 16,
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
});

export default CollectionScreen;
