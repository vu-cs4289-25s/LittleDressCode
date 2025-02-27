import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ItemContainer from "./ItemContainer"; // Your clothing item component

const GridLayout = ({ data, numColumns = 2 }) => {
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            renderItem={({ item }) => (
                <View style={styles.gridItem}>
                    <ItemContainer clothingItem={item.image} />
                </View>
            )}
            contentContainerStyle={styles.grid} // Adds padding around the grid
            columnWrapperStyle={styles.row} // Adds spacing between columns
        />
    );
};

const styles = StyleSheet.create({
    grid: {
        padding: 16, // Padding around the entire grid
    },
    row: {
        justifyContent: "space-between", // Ensures even spacing between columns
        gap: 16, // Adds 16px gap between columns
    },
    gridItem: {
        flex: 1, 
        marginBottom: 16, // Adds 16px gap between rows
    },
});

export default GridLayout;
