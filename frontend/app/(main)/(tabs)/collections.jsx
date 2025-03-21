import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from "react-native";
import AccordionView from "../../../components/AccordionView";
import theme from "../../../styles/theme";

const CollectionScreen = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedButtons, setSelectedButtons] = useState({});

  // Fetch data in the parent component
  useEffect(() => {
    setTimeout(() => {
      setSections([
        {
          id: 1,
          title: "Category",
          buttons: [
            { label: "Tops", onPress: () => console.log("Tops clicked") },
            { label: "Pants", onPress: () => console.log("Pants clicked") },
            { label: "Skirts", onPress: () => console.log("Skirts clicked") },
            { label: "Dresses", onPress: () => console.log("Dresses clicked") },
            { label: "Bags", onPress: () => console.log("Bags clicked") },
            { label: "Shoes", onPress: () => console.log("Shoes clicked") },
            { label: "Outwear", onPress: () => console.log("Outwear clicked") },
            { label: "Jewelry", onPress: () => console.log("Jewelry clicked") },
            { label: "Hats", onPress: () => console.log("Hats clicked") },
          ],
        },
        {
          id: 2,
          title: "Color",
          buttons: [
            { label: "Red", onPress: () => console.log("Red Clicked") },
          ],
        },
        {
          id: 3,
          title: "Style",
          buttons: [
            { label: "Casual", onPress: () => console.log("Style!") },
          ],
        },
        {
          id: 4,
          title: "Season",
          buttons: [
            { label: "Fall", onPress: () => console.log("Fall") },
          ],
        },
        {
          id: 5,
          title: "Fit",
          buttons: [
            { label: "Loose", onPress: () => console.log("Loose") },
          ],
        },
      ]);
      setLoading(false);
    }, 0);
  }, []);

  // Toggle button selection
  const handleSelectButton = (sectionId, buttonLabel) => {
    setSelectedButtons((prev) => {
      const currentSelection = prev[sectionId] || [];

      // Toggle selection: Add if not selected, remove if already selected
      const updatedSelection = currentSelection.includes(buttonLabel)
        ? currentSelection.filter((label) => label !== buttonLabel)
        : [...currentSelection, buttonLabel];

      return { ...prev, [sectionId]: updatedSelection };
    });
  };

  // Function to save selections to backend
  const saveSelections = async () => {
    try {
      const response = await fetch("https://your-api.com/save-selections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedButtons }),
      });

      if (!response.ok) {
        throw new Error("Failed to save selections");
      }
      console.log("Selections saved successfully!", selectedButtons);
    } catch (error) {
      console.error("Error saving selections:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AccordionView
          sections={sections}
          selectedButtons={selectedButtons}
          onSelectButton={handleSelectButton}
        />
      )}

      {/* Save Selections Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveSelections}>
        <Text style={styles.saveButtonText}>Add Items!</Text>
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
  saveButton: {
    backgroundColor: theme.colors.buttonBackground.dark,
    height: 53,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 26,
    alignItems: "center",
    marginBottom: 90,
  },
  saveButtonText: {
    color: theme.colors.text.lightest,
    fontSize: 16,
  },
});

export default CollectionScreen;
