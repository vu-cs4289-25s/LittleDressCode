import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getAuth } from "firebase/auth";

import Header from "@/components/headers/Header";
import ItemContainer from "@/components/organization/ItemContainer";
import TextField from "@/components/common/Textfield";
import AccordionView from "@/components/AccordionView";
import { addCollection } from "../../utils/collectionsService";

import dummy1 from "../../../assets/images/dummy/outfits/img-1.png";
import dummy2 from "../../../assets/images/dummy/outfits/img-2.png";
import dummy3 from "../../../assets/images/dummy/outfits/img-3.png";
import dummy4 from "../../../assets/images/dummy/outfits/img-4.png";
import dummy5 from "../../../assets/images/dummy/outfits/img-5.png";
import dummy6 from "../../../assets/images/dummy/outfits/img-6.png";

const dummyStartData = [
  { id: 1, image: dummy1 },
  { id: 2, image: dummy2 },
  { id: 3, image: dummy3 },
  { id: 4, image: dummy4 },
  { id: 5, image: dummy5 },
  { id: 6, image: dummy6 },
];

const NewCollection = () => {
  const { selected } = useLocalSearchParams();
  const selectedIds = JSON.parse(selected || "[]");

  const selectedOutfits = dummyStartData.filter((item) =>
    selectedIds.includes(item.id)
  );

  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});

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
    const userId = getAuth().currentUser?.uid;
    if (!userId || !name.trim()) {
      console.warn("Missing user or name");
      return;
    }

    const outfitIds = selectedOutfits.map((item) => item.id);
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
          {selectedOutfits.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <ItemContainer
                clothingItem={item.image}
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
    paddingBottom: 40, // enough space for bottom button to show fully
  },
});

export default NewCollection;
