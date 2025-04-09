import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ItemContainer from "./ItemContainer";

const GridLayout = ({
  data,
  numColumns = 2,
  isSelectable = false,
  selectedIds = [],
  toggleSelect = () => {},
  isFavorited = () => false,
  toggleFavorite = () => {},
  renderItem: customRenderItem = null, // Customizable for specific layout needs
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={numColumns}
      renderItem={({ item }) => {
        return customRenderItem ? (
          customRenderItem(item)
        ) : (
          <View style={styles.gridItem}>
            <ItemContainer
              clothingItem={item.imageUrl || item.image}
              isFavorited={isFavorited(item.id)}
              toggleFavorite={() => toggleFavorite(item.id)}
              isSelectable={isSelectable}
              isSelected={selectedIds.includes(item.id)}
              onSelect={() => toggleSelect(item.id)}
            />
          </View>
        );
      }}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    gap: 16,
  },
  gridItem: {
    flex: 1,
    marginBottom: 16,
    aspectRatio: 1,
  },
});

export default GridLayout;
