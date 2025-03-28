import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
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
  const [name, setName] = useState("");

  useEffect(() => {
    setSections([
      {
        id: 1,
        title: "Category",
        buttons: [
          { label: "Tops" }, { label: "Pants" }, { label: "Skirts" },
          { label: "Dresses" }, { label: "Bags" }, { label: "Shoes" },
          { label: "Outerwear" }, { label: "Jewelry" }, { label: "Hats" },
        ],
      },
      {
        id: 2,
        title: "Color",
        buttons: [
          { label: "Red" }, { label: "Blue" }, { label: "Black" },
          { label: "White" }, { label: "Green" }, { label: "Yellow" },
          { label: "Pink" }, { label: "Gray" },
        ],
      },
      {
        id: 3,
        title: "Style",
        buttons: [
          { label: "Casual" }, { label: "Formal" }, { label: "Sporty" },
          { label: "Streetwear" }, { label: "Boho" },
        ],
      },
      {
        id: 4,
        title: "Season",
        buttons: [
          { label: "Spring" }, { label: "Summer" },
          { label: "Fall" }, { label: "Winter" },
        ],
      },
      {
        id: 5,
        title: "Fit",
        buttons: [
          { label: "Tight" }, { label: "Regular" },
          { label: "Loose" }, { label: "Oversized" },
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
    const userId = "testUser123"; // Replace with real user ID

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

    console.log("Clothing Data to Save:", clothingData); // Debug print

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
      console.log(" Clothing item saved successfully!");
      router.back();
    } catch (error) {
      console.error(" Error saving clothing item:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Item Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter item name"
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          marginBottom: 12,
        }}
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
