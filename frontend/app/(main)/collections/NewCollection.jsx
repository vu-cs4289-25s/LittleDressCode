import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";

import Header from "@/components/headers/Header";
import ItemContainer from "@/components/organization/ItemContainer";
import TextField from "@/components/common/Textfield";
import AccordionView from "@/components/AccordionView";
import { auth, db } from "@/app/utils/firebaseConfig";
import { addCollection } from "@/app/utils/collectionsService";

const NewCollection = () => {
  const { selected } = useLocalSearchParams();
  const selectedIds = JSON.parse(selected || "[]");

  const [outfits, setOutfits] = useState([]);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const snapshot = await getDocs(collection(db, "outfits"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const selectedOutfits = data.filter((item) =>
          selectedIds.includes(item.id)
        );
        setOutfits(selectedOutfits);
      } catch (error) {
        console.error("Error fetching outfits:", error);
      }
    };

    fetchOutfits();
  }, [selectedIds]);

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
    const userId = auth.currentUser?.uid;
    if (!userId || !name.trim()) {
      console.warn("Missing user or name");
      return;
    }

    const outfitIds = outfits.map((item) => item.id);
    const tags = [
      ...(selectedButtons["season"] || []),
      ...(selectedButtons["occasion"] || []),
    ];

    try {
      const docId = await addCollection(
        userId,
        name.trim(),
        outfitIds,
        "",
        tags,
        true
      );
      console.log("Saved collection ID:", docId);
      router.push("/collections");
    } catch (error) {
      console.error("Error saving collection:", error);
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {outfits.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <ItemContainer
                clothingItem={{ uri: item.imageUrl }}
                isFavorited={false}
                toggleFavorite={() => {}}
                isSelectable={false}
                isSelected={false}
                showControls={false}
              />
            </View>
          ))}
        </ScrollView>

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
    gap: 12,
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
