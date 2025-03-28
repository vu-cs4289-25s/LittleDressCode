// import React from "react";
// import { View, FlatList, StyleSheet } from "react-native";
// import ItemContainer from "./ItemContainer" // Your clothing item component


// const GridLayout = ({ data, numColumns = 2 }) => {
//     return (
//         <FlatList
//             data={data}
//             keyExtractor={(item) => item.id.toString()}
//             numColumns={numColumns}
//             renderItem={({ item }) => (
//                 <View style={styles.gridItem}>
//                     <ItemContainer clothingItem={item.image} />
//                 </View>
//             )}
//             contentContainerStyle={styles.grid} // Adds padding around the grid
//             columnWrapperStyle={styles.row} // Adds spacing between columns
//         />
//     );
// };

// const styles = StyleSheet.create({
//     grid: {
//         padding: 16, // Padding around the entire grid
//     },
//     row: {
//         justifyContent: "space-between", // Ensures even spacing between columns
//         gap: 16, // Adds 16px gap between columns
//     },
//     gridItem: {
//         flex: 1, 
//         marginBottom: 16, // Adds 16px gap between rows
//     },
// });

// export default GridLayout;

import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ItemContainer from "./ItemContainer";

const GridLayout = ({ data, dummyData, numColumns = 2 }) => {
  const displayData = data.length > 0 ? data : dummyData;

  return (
    <FlatList
      data={displayData}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <ItemContainer clothingItem={item.imageUrl || item.image} />
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
    aspectRatio: 1,
  },
});

export default GridLayout;

