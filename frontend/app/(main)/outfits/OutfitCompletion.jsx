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

// Categories & Tabs
const categories = ["All", "Tops", "Pants", "Shoes", "Jackets"];
const tabs = ["Mix & Match", "Canvas", "Use AI"];

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

const OutfitCompletion = () => {
  const [selectedButtons, setSelectedButtons] = useState({});

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
  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <StyleHeader title={"New Outfit"} />
        <View style={styles.accordianWrapper}>
          <AccordionView
            title="Tag this Collection"
            sections={sections}
            selectedButtons={selectedButtons}
            onSelectButton={onSelectButton}
          />
        </View>
      </View>
      Outfitend
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
  container: {
    backgroundColor: "white",
    padding: 16,
    gap: 20,
  },
});

export default OutfitCompletion;
