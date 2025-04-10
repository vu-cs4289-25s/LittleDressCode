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
  renderItem: customRenderItem = null,
  onItemPress = null, // ✅ new prop
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
              onSelect={
                () =>
                  isSelectable ? toggleSelect(item.id) : onItemPress?.(item) // ✅ trigger press if not selecting
              }
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
  row: {
    justifyContent: "space-between",
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gridItem: {
    flexBasis: "48%", // slightly less than 50% to leave room for margin
    flexGrow: 0,
    marginBottom: 16,
  },
});

export default GridLayout;
