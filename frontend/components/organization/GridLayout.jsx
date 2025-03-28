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
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <ItemContainer
            clothingItem={item.image}
            isFavorited={isFavorited(item.id)}
            toggleFavorite={() => toggleFavorite(item.id)}
            isSelectable={isSelectable}
            isSelected={selectedIds.includes(item.id)}
            onSelect={() => toggleSelect(item.id)}
          />
        </View>
      )}
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
  },
});

export default GridLayout;
