import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import StyleHeader from "@/components/headers/BackHeader";
import AccordionView from "@/components/AccordionView";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextButton from "@/components/common/TextButton";
import { addOutfit } from "../../utils/outfitService";
import { auth } from "@/app/utils/firebaseConfig";
import ArrangeItems from "./ArrangeItems";
import TextField from "@/components/common/Textfield";

const OutfitCompletion = () => {
  const { selectedItems } = useLocalSearchParams();
  const parsedItems = selectedItems ? JSON.parse(selectedItems) : [];
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedButtons, setSelectedButtons] = useState({});
  const [name, setName] = useState("");
  const [sections, setSections] = useState([]);

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

  const saveOutfit = async () => {
    const userId = auth.currentUser?.uid;
    const images= parsedItems.map((item) => item.imageUrl);

    const outfitData = {
      userId,
      name: name.trim() || "Untitled Outfit",
      clothingItems: parsedItems || [],
      category: selectedButtons[1] || [],
      season: selectedButtons[4] || [],
      style: selectedButtons[3] || [],
      fit: selectedButtons[5] || [],
    //   imageUrl: generatedImageUri || parsedItems[0]?.imageUrl || null,
    imageUrl: images[0], //temp
      isPublic: false,
    };

    console.log("outfit");
    console.log(outfitData)
    console.log(outfitData.imageUrl);
    try {
      await addOutfit(
        outfitData.userId,
        outfitData.name,
        outfitData.clothingItems,
        outfitData.category,
        outfitData.season,
        outfitData.style,
        outfitData.fit,
        outfitData.imageUrl,
        outfitData.isPublic
      );

      console.log(" Outfit created successfully!");
      router.push("/outfits");
    } catch (error) {
      console.error("Error saving outfit:", error);
      alert("Failed to save outfit.");
    }
  };

  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <StyleHeader title={"New Outfit"} />
        <View style={styles.selectedImagesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {parsedItems && parsedItems.length > 0 ? (
              parsedItems.map((item, index) => (
                //change styling later
                <Image
                  key={item.id || index}
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 150,
                    height: 150,
                    marginRight: 10,
                    borderRadius: 10,
                    backgroundColor: "#eee",
                  }}
                />
              ))
            ) : (
              <Text>No items selected</Text>
            )}
          </ScrollView>
        </View>
        <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Item Name</Text>
        <TextField
          placeholder="Enter outfit name"
          value={name}
          onChangeText={setName}
          size="large"
        />
        <View style={styles.accordianWrapper}>
          <AccordionView
            title="Tag this Collection"
            sections={sections}
            selectedButtons={selectedButtons}
            onSelectButton={onSelectButton}
          />
        </View>
      </View>
      <View style={styles.containerButton}>
        <TextButton
          title="Next"
          size="large"
          color="dark"
          onPress={saveOutfit}
        />
      </View>

      {/* <ArrangeItems
        imageUrls={parsedItems.map((item) => item.imageUrl)}
        onCombined={(uri) => {
          console.log("Combined image:", uri);
          // Do something with it, like upload or save
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  bigContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 80,
    position: "relative",
  },
  containerButton: {
    padding: 16,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  container: {
    backgroundColor: "white",
    padding: 16,
    gap: 20,
    height: 900,
  },
  accordianWrapper: {
    height: "100%",
  },
});

export default OutfitCompletion;
