import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import Header from "@/components/headers/Header";
import GridLayout from "@/components/organization/GridLayout";
import TextField from "@/components/common/Textfield";
import AccordionView from "@/components/AccordionView";
import theme from "@/styles/theme";

const tagSections = [
  {
    id: "occasion",
    title: "Occasion",
    buttons: ["Casual", "Work", "Formal", "Travel"].map((label) => ({ label })),
  },
  {
    id: "season",
    title: "Season",
    buttons: ["Spring", "Summer", "Fall", "Winter"].map((label) => ({ label })),
  },
];

const ViewCollectionScreen = () => {
  const { id } = useLocalSearchParams();
  const [collectionData, setCollectionData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});

  useEffect(() => {
    const fetchCollection = async () => {
      const docRef = doc(db, "collections", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCollectionData({ id: docSnap.id, ...data });
        setName(data.name || "");
        setSelectedOutfits(data.outfits || []);
        organizeTags(data.tags || []);
      }
    };

    fetchCollection();
  }, [id]);

  const organizeTags = (tags) => {
    const buttons = {};
    for (const section of tagSections) {
      buttons[section.id] = section.buttons
        .map((b) => b.label)
        .filter((label) => tags.includes(label));
    }
    setSelectedButtons(buttons);
  };

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

  const handleOutfitPress = (id) => {
    if (!isEditing) return;

    const isSelected = selectedOutfits.includes(id);
    setSelectedOutfits((prev) =>
      isSelected ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleAddOutfits = () => {
    router.push(`/outfits?mode=select&returnTo=collections/${id}`);
  };

  const handleSave = async () => {
    const updatedTags = [
      ...(selectedButtons["season"] || []),
      ...(selectedButtons["occasion"] || []),
    ];

    await updateDoc(doc(db, "collections", id), {
      name: name.trim(),
      tags: updatedTags,
      outfits: selectedOutfits,
    });

    setCollectionData({
      ...collectionData,
      name: name.trim(),
      tags: updatedTags,
      outfits: selectedOutfits,
    });

    setIsEditing(false);
  };

  if (!collectionData) return <Text>Loading...</Text>;

  const displayedGrid = isEditing
    ? [{ id: "add", imageUrl: null }, ...selectedOutfits.map((id) => ({ id }))]
    : selectedOutfits.map((id) => ({ id }));

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? "Edit Collection" : collectionData.name}
        rightButtonText={isEditing ? "Cancel" : "Edit"}
        onRightButtonPress={() => setIsEditing((prev) => !prev)}
        showBackButton
        backTo="/collections"
        showSearch={false}
      />

      <GridLayout
        data={displayedGrid}
        numColumns={2}
        renderItem={(item) =>
          item.id === "add" ? (
            <TouchableOpacity onPress={handleAddOutfits} style={styles.addCard}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleOutfitPress(item.id)}
              style={[
                styles.outfitCard,
                isEditing && !selectedOutfits.includes(item.id) && styles.inactiveCard,
              ]}
            >
              <Image
                source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
                style={styles.image}
              />
            </TouchableOpacity>
          )
        }
      />

      {isEditing && (
        <View style={styles.editControls}>
          <TextField
            icon="edit"
            placeholder="Collection name"
            size="medium"
            value={name}
            onChangeText={setName}
          />

          <AccordionView
            title="Edit Tags"
            sections={tagSections}
            selectedButtons={selectedButtons}
            onSelectButton={onSelectButton}
          />

          <Button title="Save Changes" onPress={handleSave} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
    padding: 16,
  },
  outfitCard: {
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: theme.colors.backgrounds.secondary,
    overflow: "hidden",
    margin: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  inactiveCard: {
    opacity: 0.3,
  },
  addCard: {
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  plus: {
    fontSize: 36,
    color: "#888",
  },
  editControls: {
    marginTop: 16,
    gap: 12,
  },
});

export default ViewCollectionScreen;
