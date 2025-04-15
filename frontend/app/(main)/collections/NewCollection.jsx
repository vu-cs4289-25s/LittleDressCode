import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Button, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "@/app/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import Header from "@/components/headers/Header";
import ItemContainer from "@/components/organization/ItemContainer";
import TextField from "@/components/common/Textfield";
import AccordionView from "@/components/AccordionView";
import { addCollection } from "@/app/utils/collectionsService";
import { useFocusEffect } from "@react-navigation/native";

const sections = [
  {
    id: "occasion",
    title: "Occasion",
    buttons: [
      { label: "Casual" },
      { label: "Work" },
      { label: "Formal" },
      { label: "Travel" },
    ],
  },
  {
    id: "season",
    title: "Season",
    buttons: [
      { label: "Spring" },
      { label: "Summer" },
      { label: "Fall" },
      { label: "Winter" },
    ],
  },
];

const NewCollection = () => {
  const { selected } = useLocalSearchParams();
  const selectedIds = JSON.parse(selected || "[]");
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Authenticated user:", user.uid);
        setUserId(user.uid);
      } else {
        console.warn("No user logged in.");
      }
    });
    return unsubscribe;
  }, []);

  // Fetch selected outfits
  const fetchSelectedOutfits = async () => {
    console.log("Fetching selected outfits for IDs:", selectedIds);
    try {
      const snapshot = await getDocs(collection(db, "outfits"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((item) => selectedIds.includes(item.id));
      console.log("Filtered outfits:", filtered);
      setOutfits(filtered);
    } catch (err) {
      console.error("Error fetching outfits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId && selectedIds.length > 0) {
        fetchSelectedOutfits();
      }
    }, [userId])
  );

  const onSelectButton = (sectionId, buttonLabel) => {
    setSelectedButtons((prev) => {
      const current = prev[sectionId] || [];
      const alreadySelected = current.includes(buttonLabel);
      return {
        ...prev,
        [sectionId]: alreadySelected
          ? current.filter((label) => label !== buttonLabel)
          : [...current, buttonLabel],
      };
    });
  };

  const handleSave = async () => {
    if (!userId || !name.trim()) {
      console.warn("⚠️ Missing user or collection name");
      return;
    }

    const outfitIds = outfits.map((item) => item.id);
    const tags = [
      ...(selectedButtons["season"] || []),
      ...(selectedButtons["occasion"] || []),
    ];

    console.log("Saving new collection with:");
    console.log("User ID:", userId);
    console.log("Name:", name.trim());
    console.log("Outfit IDs:", outfitIds);
    console.log("Tags:", tags);

    try {
      const docId = await addCollection(
        userId,
        name.trim(),
        outfitIds,
        "",
        tags,
        true
      );

      console.log("Collection created with ID:", docId);

      // Navigate and refresh collections page
      router.replace("/");
    } catch (err) {
      console.error("Error saving collection:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="New Collection"
        showBackButton
        backTo="/outfits"
        showSearch={false}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <Text>Loading selected outfits...</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {outfits.map((item) => (
              <View key={item.id} style={styles.itemWrapper}>
                <ItemContainer
                  clothingItem={item}
                  isFavorited={false}
                  toggleFavorite={() => {}}
                  isSelectable={false}
                  isSelected={false}
                  showControls={false}
                  isOutfit={true}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputWrapper}>
          <TextField
            icon="edit"
            placeholder="Give your collection a name!"
            size="medium"
            onChangeText={setName}
          />
        </View>

        <View style={styles.accordianWrapper}>
          <AccordionView
            title="Tag this Collection"
            sections={sections}
            selectedButtons={selectedButtons}
            onSelectButton={onSelectButton}
          />
        </View>

        <Button title="Save Collection" onPress={handleSave} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },
  body: {
    flex: 1,
  },
  scroll: {
    marginBottom: 0,
    maxHeight: 200,
  },
  scrollContent: {
    paddingRight: 16,
  },
  itemWrapper: {
    marginRight: 12,
    alignSelf: "flex-start",
  },
  inputWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  accordianWrapper: {},
  bodyContent: {
    gap: 12,
    paddingBottom: 40,
  },
});

export default NewCollection;
