import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../common/Modal';
import theme from '../../styles/theme';

const FILTER_CATEGORIES = {
  Category: ['Tops', 'Pants', 'Skirts', 'Dresses', 'Bags', 'Shoes', 'Outerwear', 'Jewelry', 'Hats'],
  Color: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Orange', 'Purple', 'Pink', 'Gray', 'Brown'],
  Style: ['Casual', 'Formal', 'Streetwear', 'Sporty'],
  Season: ['Summer', 'Winter', 'Spring', 'Fall'],
  Fit: ['Slim', 'Loose', 'Regular', 'Tight', 'Oversized']
};

const MAX_VISIBLE = 10;

const FilterBar = ({ onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [visibleFilters, setVisibleFilters] = useState([]);

  useEffect(() => {
    setVisibleFilters(selectedFilters.slice(0, MAX_VISIBLE));
  }, [selectedFilters]);

  const toggleFilter = (filter) => {
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterIcon} onPress={() => setModalVisible(true)}>
        <Ionicons name="filter" size={20} color={theme.colors.text.lightest} />
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {visibleFilters.map((filter, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => toggleFilter(filter)}
            style={[styles.tag, selectedFilters.includes(filter) && styles.tagSelected]}
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

      <Modal isVisible={modalVisible} onClose={() => setModalVisible(false)} onApply={applyFilters}>
        <ScrollView>
          {Object.entries(FILTER_CATEGORIES).map(([group, values]) => (
            <View key={group} style={styles.section}>
              <Text style={styles.sectionTitle}>{group}</Text>
              <View style={styles.tagsContainer}>
                {values.map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => toggleFilter(val)}
                    style={[styles.tag, selectedFilters.includes(val) && styles.tagSelected]}
                  >
                    <Text
                      style={
                        selectedFilters.includes(val)
                          ? styles.textSelected
                          : styles.text
                      }
                    >
                      {val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.medium },
  filterIcon: {
    backgroundColor: theme.colors.buttonBackground.dark,
    borderRadius: theme.borderRadius.default,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  scroll: { flexGrow: 0 },
  tag: {
    backgroundColor: theme.colors.neutral.gray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8
  },
  tagSelected: {
    backgroundColor: theme.colors.neutral.black
  },
  text: {
    color: theme.colors.text.dark,
    fontWeight: '600'
  },
  textSelected: {
    color: theme.colors.text.lightest,
    fontWeight: '600'
  },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' }
});

export default FilterBar;
