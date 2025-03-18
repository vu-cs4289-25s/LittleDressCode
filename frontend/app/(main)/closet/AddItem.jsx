import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; 
import AccordionView from "../../../components/AcordianView";
import theme from "../../../styles/theme";

const AddItem = () => {
  const { imageUrl } = useLocalSearchParams(); // Access the imageUrl parameter
  const router = useRouter(); 
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedButtons, setSelectedButtons] = useState({});


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


  const handleSelectButton = (sectionId, buttonLabel) => {
    setSelectedButtons((prev) => {
      const currentSelection = prev[sectionId] || [];

     
      const updatedSelection = currentSelection.includes(buttonLabel)
        ? currentSelection.filter((label) => label !== buttonLabel)
        : [...currentSelection, buttonLabel];

      return { ...prev, [sectionId]: updatedSelection };
    });
  };

  const goBackToCloset = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Show AccordionView */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <AccordionView
          sections={sections}
          selectedButtons={selectedButtons}
          onSelectButton={handleSelectButton}
        />
      )}


      <TouchableOpacity style={styles.saveButton} onPress={goBackToCloset}>
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