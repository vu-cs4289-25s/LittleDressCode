import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AccordionView from "@/components/AccordionView";
import theme from "@/styles/theme";
import { addClothingItem } from "@/app/utils/clothingService";
import { auth } from "@/app/utils/firebaseConfig";
import BackHeader from "@/components/headers/BackHeader";
import TextButton from "@/components/common/TextButton";
import TextField from "@/components/common/Textfield";

const AddItem = () => {
  const { imageUrl } = useLocalSearchParams();
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedButtons, setSelectedButtons] = useState({});
  const [name, setName] = useState("");

  useEffect(() => {
    setSections([
      {
        id: 1,
        title: "Category",
        buttons: [
          { label: "Tops" },
          { label: "Pants" },
          { label: "Skirts" },
          { label: "Dresses" },
          { label: "Bags" },
          { label: "Shoes" },
          { label: "Outerwear" },
          { label: "Jewelry" },
          { label: "Hats" },
        ],
      },
      {
        id: 2,
        title: "Color",
        buttons: [
          { label: "Red" },
          { label: "Blue" },
          { label: "Black" },
          { label: "White" },
          { label: "Green" },
          { label: "Yellow" },
          { label: "Pink" },
          { label: "Gray" },
          { label: "Brown" },
          { label: "Purple" },
          { label: "Orange" },
          { label: "Multicolor" },
        ],
      },
      {
        id: 3,
        title: "Style",
        buttons: [
          { label: "Casual" },
          { label: "Formal" },
          { label: "Sporty" },
          { label: "Streetwear" },
          { label: "Boho" },
        ],
      },
      {
        id: 4,
        title: "Season",
        buttons: [
          { label: "Spring" },
          { label: "Summer" },
          { label: "Fall" },
          { label: "Winter" },
          { label: "Any" },
        ],
      },
      {
        id: 5,
        title: "Fit",
        buttons: [
          { label: "Tight" },
          { label: "Regular" },
          { label: "Loose" },
          { label: "Oversized" },
        ],
      },
    ]);
    setLoading(false);
  }, []);

  const handleSelectButton = (categoryId, tag) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId]?.includes(tag)
        ? prev[categoryId].filter((selected) => selected !== tag)
        : [...(prev[categoryId] || []), tag],
    }));
  };

  const saveClothingItem = async () => {
    const userId = auth.currentUser?.uid;

    const clothingData = {
      userId,
      name: name.trim() || "Give This Item A Name",
      category: selectedButtons[1] || [],
      color: selectedButtons[2] || [],
      style: selectedButtons[3] || [],
      season: selectedButtons[4] || [],
      fit: selectedButtons[5] || [],
      imageUrl: imageUrl || null,
    };

    console.log("🧥 Clothing Data to Save:", clothingData);

    try {
      await addClothingItem(
        clothingData.userId,
        clothingData.name,
        clothingData.category,
        clothingData.color,
        clothingData.style,
        clothingData.season,
        clothingData.fit,
        clothingData.imageUrl
      );
      console.log("✅ Clothing item saved successfully!");
      router.back();
    } catch (error) {
      console.error("❌ Error saving clothing item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title={"New Item"} />
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Item Name</Text>
        <TextField
          size="large"
          onChangeText={setName}
          value={name}
          placeholder={"Enter item name"}
          icon="edit"
        />

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <AccordionView
            sections={sections}
            selectedButtons={selectedButtons}
            onSelectButton={handleSelectButton}
          />
        )}
      </ScrollView>

      <View style={styles.containerButton}>
        <TextButton
          title="Add Item"
          size="large"
          color="dark"
          onPress={saveClothingItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
    padding: 10,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  scrollContent: {
    paddingHorizontal: theme.padding.normal,
    paddingBottom: 150,
  },
  containerButton: {
    padding: 16,
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
  },
  label: {
    marginBottom: 6,
    fontWeight: "bold",
  },
});

export default AddItem;
