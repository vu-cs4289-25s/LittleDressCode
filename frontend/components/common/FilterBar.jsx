import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Modal from "../common/Modal";
import theme from "../../styles/theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AccordionView from "../AccordionView";

const FILTER_CATEGORIES = {
  Category: [  
    "Tops",
    "Pants",
    "Skirts",
    "Dresses",
    "Bags",
    "Shoes",
    "Outerwear",
    "Jewelry",
    "Hats",
  ],
  Color: [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Orange",
    "Purple",
    "Pink",
    "Gray",
    "Brown",
  ],
  Style: ["Casual", "Formal", "Streetwear", "Sporty"],
  Season: ["Summer", "Winter", "Spring", "Fall"],
  Fit: ["Slim", "Loose", "Regular", "Tight", "Oversized"],
  Favorite: ["Favorited"], // ✅ Added Favorited
};

const ICONS = [
  <FontAwesome6 name="shirt" color="#734230" size={18} />,
  <MaterialIcons name="palette" color="#FF9F0A" size={20} />,
  <MaterialIcons name="style" color="#E1289B" size={20} />,
  <MaterialIcons name="sunny" color="#261BAC" size={20} />,
  <FontAwesome5 name="ruler-vertical" color="#096B91" size={18} />,
];

const MAX_VISIBLE = 10;

const FilterBar = ({ onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState([]);

  useEffect(() => {
    setVisibleFilters(selectedFilters.slice(0, MAX_VISIBLE));
  }, [selectedFilters]);

  const getCategoryForFilter = (filter) => {
    return Object.entries(FILTER_CATEGORIES).find(([, values]) =>
      values.includes(filter)
    )?.[0];
  };

  const toggleFilter = (category, filter) => {
    setSelectedFilters((prev) => {
      const updated = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];
      onFilterChange(updated);
      return updated;
    });
  };

  const applyFilters = (newSelections) => {
    const selections = Array.isArray(newSelections) ? newSelections : [];
    const combined = [...new Set([...selectedFilters, ...selections])];
    setSelectedFilters(combined);
    onFilterChange(combined);
    setModalVisible(false);
  };

  const sections = Object.entries(FILTER_CATEGORIES).map(
    ([title, filters], index) => ({
      id: title,
      title,
      buttons: filters.map((filter) => ({ label: filter })),
    })
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterIcon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="filter" size={20} color={theme.colors.text.lightest} />
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {visibleFilters.map((filter, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => toggleFilter(getCategoryForFilter(filter), filter)} // ✅ Fix here
            style={[
              styles.tag,
              selectedFilters.includes(filter) && styles.tagSelected,
            ]}
          >
            <Text
              style={
                selectedFilters.includes(filter)
                  ? styles.textSelected
                  : styles.text
              }
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={applyFilters}
      >
        <AccordionView
          sections={sections}
          selectedButtons={selectedFilters.reduce((acc, filter) => {
            const category = Object.keys(FILTER_CATEGORIES).find((cat) =>
              FILTER_CATEGORIES[cat].includes(filter)
            );
            if (category) {
              acc[category] = acc[category] || [];
              acc[category].push(filter);
            }
            return acc;
          }, {})}
          onSelectButton={toggleFilter}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", paddingLeft: 16 },
  filterIcon: {
    backgroundColor: theme.colors.buttonBackground.dark,
    borderRadius: theme.borderRadius.default,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  scroll: { flexGrow: 0 },
  tag: {
    backgroundColor: theme.colors.neutral.gray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  tagSelected: {
    backgroundColor: theme.colors.neutral.black,
  },
  text: {
    color: theme.colors.text.dark,
    fontWeight: "600",
  },
  textSelected: {
    color: theme.colors.text.lightest,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5,
    marginBottom: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterBar;
