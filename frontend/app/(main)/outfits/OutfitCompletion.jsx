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
import theme from "@/styles/theme";

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
    const images = parsedItems.map((item) => item.imageUrl);

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
    console.log(outfitData);
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
    <View style={styles.container}>
      <StyleHeader title={"New Outfit"} />
      <View style={styles.outfitRow}>
        {parsedItems.map((src, index) => {
          const total = parsedItems.length;
          const imageSize = total <= 3 ? 150 : total <= 5 ? 120 : 90;
          const overlap = total <= 3 ? -20 : total <= 5 ? -30 : -40;

          return (
            <Image
              key={index}
              source={{ uri: src.imageUrl }}
              style={{
                width: imageSize,
                height: imageSize,
                marginLeft: index === 0 ? 0 : overlap,
                zIndex: total - index,
              }}
              resizeMode="cover"
            />
          );
        })}
      </View>
      <View style={styles.containerMain}>
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
          title="Save Outfit"
          size="large"
          color="dark"
          onPress={saveOutfit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerButton: {
    padding: 16,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  accordianWrapper: {
    height: "100%",
  },
  outfitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 250,
    marginBottom: 16,
    paddingVertical: 40,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  outfitImageRow: {
    width: 150,
    height: 150,
  },
  containerMain: {
    paddingHorizontal: theme.padding.normal,
  },
});

export default OutfitCompletion;
