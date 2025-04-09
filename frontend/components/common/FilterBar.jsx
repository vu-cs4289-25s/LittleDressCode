// components/common/FilterBar.jsx
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
import Ionicons from "@expo/vector-icons/Ionicons";
import AccordionView from "../AccordionView";

const MAX_VISIBLE = 10;

const FilterBar = ({ filters, onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState([]);

  useEffect(() => {
    setVisibleFilters(selectedFilters.slice(0, MAX_VISIBLE));
  }, [selectedFilters]);

  const getCategoryForFilter = (filter) => {
    return Object.entries(filters).find(([, values]) =>
      values.includes(filter)
    )?.[0];
  };

  const toggleFilter = (category, filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleFilterWithApply = (category, filter) => {
    const updated = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter];
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const applyFilters = (newSelections) => {
    const selections = Array.isArray(newSelections) ? newSelections : [];
    const combined = [...new Set([...selectedFilters, ...selections])];
    setSelectedFilters(combined);
    onFilterChange(combined);
    setModalVisible(false);
  };

  const sections = Object.entries(filters).map(([title, values]) => ({
    id: title,
    title,
    buttons: values.map((filter) => ({ label: filter })),
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterIcon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="filter" size={20} color={theme.colors.text.lightest} />
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {visibleFilters.map((filter, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => toggleFilterWithApply(getCategoryForFilter(filter), filter)}
            style={[
              styles.tag,
              selectedFilters.includes(filter) && styles.tagSelected,
            ]}
          >
            <Text style={selectedFilters.includes(filter) ? styles.textSelected : styles.text}>
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
            const category = getCategoryForFilter(filter);
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
});

export default FilterBar;
