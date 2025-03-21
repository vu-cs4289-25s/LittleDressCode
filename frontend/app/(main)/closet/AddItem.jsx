import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AccordionView from "../../../components/AccordionView"; 
import theme from "../../../styles/theme";
import { addClothingItem } from "../../utils/clothingService"; 

const AddItem = () => {
  const { imageUrl } = useLocalSearchParams();
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedButtons, setSelectedButtons] = useState({}); 

  useEffect(() => {
    setTimeout(() => {
      setSections([
        { id: 1, title: "Category", buttons: [{ label: "Tops" }, { label: "Pants" }, { label: "Skirts" }, { label: "Dresses" }, { label: "Bags" }, { label: "Shoes" }, { label: "Outerwear" }, { label: "Jewelry" }, { label: "Hats" }] },
        { id: 2, title: "Color", buttons: [{ label: "Red" }, { label: "Blue" }, { label: "Black" }, { label: "White" }, { label: "Green" }, { label: "Yellow" }, { label: "Pink" }] },
        { id: 3, title: "Style", buttons: [{ label: "Casual" }, { label: "Formal" }, { label: "Sporty" }, { label: "Streetwear" }, { label: "Boho" }] },
        { id: 4, title: "Season", buttons: [{ label: "Spring" }, { label: "Summer" }, { label: "Fall" }, { label: "Winter" }] },
        { id: 5, title: "Fit", buttons: [{ label: "Tight" }, { label: "Regular" }, { label: "Loose" }, { label: "Oversized" }] },
      ]);
      setLoading(false);
    }, 0);
  }, []);

  // ✅ Fix tag selection (track individual selections per category)
  const handleSelectButton = (categoryId, tag) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId]?.includes(tag)
        ? prev[categoryId].filter((selected) => selected !== tag) // Deselect if already selected
        : [...(prev[categoryId] || []), tag], // Select if not already selected
    }));
  };

  // ✅ Save to Firestore
  const saveClothingItem = async () => {
    const userId = "testUser123"; // Replace with real user ID

    const clothingData = {
      userId,
      name: "New Clothing Item",
      category: selectedButtons[1] || [],
      color: selectedButtons[2] || [],
      style: selectedButtons[3] || [],
      season: selectedButtons[4] || [],
      fit: selectedButtons[5] || [],
      imageUrl,
    };

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
      console.log("Clothing item saved successfully!");
      router.back();
    } catch (error) {
      console.error("Error saving clothing item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AccordionView
          sections={sections}
          selectedButtons={selectedButtons} 
          onSelectButton={handleSelectButton} 
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveClothingItem}>
        <Text style={styles.saveButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    height: 53,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 90,
  },
  saveButtonText: {
    color: theme.colors.text.lightest,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddItem;
