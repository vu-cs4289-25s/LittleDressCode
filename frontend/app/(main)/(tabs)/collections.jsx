import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import Header from "@/components/headers/Header";
import theme from "@/styles/theme";
import { router } from "expo-router";

const dummyImages = {
  1: require("@/assets/images/dummy/outfits/img-1.png"),
  2: require("@/assets/images/dummy/outfits/img-2.png"),
  3: require("@/assets/images/dummy/outfits/img-3.png"),
  4: require("@/assets/images/dummy/outfits/img-4.png"),
  5: require("@/assets/images/dummy/outfits/img-5.png"),
  6: require("@/assets/images/dummy/outfits/img-6.png"),
};

const CollectionScreen = () => {
  const [collections, setCollections] = useState([]);

  const handleSearch = () => {
    // search functionality
  };

  const handleNewOutfit = () => {
    router.push("/outfits?mode=select");
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const snapshot = await getDocs(collection(db, "collections"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title={"My Collections"}
        onPress={handleNewOutfit}
        handleTextChange={handleSearch}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {collections.map((col) => (
          <TouchableOpacity onPress={() => router.push(`/collections/${col.id}`)}>
          <View key={col.id} style={styles.collectionSection}>
            <View style={styles.collectionHeader}>
              <Text style={styles.collectionTitle}>{col.name}</Text>
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
                    source={dummyImages[item]}
                    style={styles.outfitImage}
                    resizeMode="contain"
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
    paddingHorizontal: 16,
  },
  collectionSection: {
    padding: 16
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
