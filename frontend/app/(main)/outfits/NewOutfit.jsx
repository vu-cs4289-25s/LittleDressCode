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
import StyleHeader from "@/components/headers/StyleHeader";
import TextButton from "@/components/common/TextButton";
import ItemContainer from "@/components/organization/ItemContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView

import Draggable from "react-draggable"; // Import react-draggable


import theme from "@/styles/theme";

// Dummy images
import dummy1 from "../../../assets/images/dummy/clothing/img-1.png";
import dummy2 from "../../../assets/images/dummy/clothing/img-2.png";
import dummy3 from "../../../assets/images/dummy/clothing/img-3.png";
import dummy4 from "../../../assets/images/dummy/clothing/img-4.png";
import dummy5 from "../../../assets/images/dummy/clothing/img-5.png";
import dummy6 from "../../../assets/images/dummy/clothing/img-6.png";
import dummy7 from "../../../assets/images/dummy/clothing/img-7.png";
import dummy8 from "../../../assets/images/dummy/clothing/img-8.png";
import dummy9 from "../../../assets/images/dummy/clothing/img-10.png";
import dummy10 from "../../../assets/images/dummy/clothing/img.png";
import dummy11 from "../../../assets/images/dummy/clothing/img-12.png";
import dummy12 from "../../../assets/images/dummy/clothing/img-13.png";
import dummy13 from "../../../assets/images/dummy/clothing/img-14.png";

const dummyStartData = [
  dummy1,
  dummy2,
  dummy3,
  dummy4,
  dummy5,
  dummy6,
  dummy7,
  dummy8,
];

const tops = [dummy1, dummy3, dummy4, dummy5, dummy6];
const bottoms = [dummy2, dummy9, dummy10];
const shoes = [dummy11, dummy12, dummy13];
const categories = ["All", "Tops", "Pants", "Shoes", "Jackets"];
const tabs = ["Mix & Match", "Canvas", "Use AI"];

// ONLY WOKRING FOR WEB!!
const DraggableItem = ({ image, id, position, onSavePosition }) => {
  const handleStop = (e, data) => {
    // Save the position when dragging stops
    onSavePosition(id, data.x, data.y);
  };

  return (
    <Draggable
      position={{ x: position.x, y: position.y }} // Initial position
      onStop={handleStop} // Handler when drag stops
    >
      <View style={styles.draggable}>
        <Image source={image} style={styles.itemImage} />
      </View>
    </Draggable>
  );
};

// MAIN
const NewOutfit = () => {
  const [selectedTab, setSelectedTab] = useState("Canvas");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);

  // Adding and removing item to the canvas
  const toggleSelect = (item) => {
    setSelectedIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((x) => x !== item.id)
        : [...prev, item.id]
    );

    if (selectedIds.includes(item.id)) {
      setSelectedItems((prevItems) =>
        prevItems.filter((i) => i.id !== item.id)
      );
    } else {
      addToCanvas(item);
    }
  };

  const [clothingData, setClothingData] = useState(
    dummyStartData.map((image, index) => ({
      id: index + 1,
      image: image,
      category: index % 2 === 0 ? "Tops" : "Pants",
    }))
  );

  const addToCanvas = (item) => {
    setSelectedItems([
      ...selectedItems,
      { 
        ...item, 
        position: { x: 0, y: 0 },  
        rotation: 0, 
      },
    ]);
  };

  const savePosition = (id, x, y, rotation) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, position: { x, y }, rotation } : item
      )
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.bigContainer}>
        <View style={styles.container}>
          <StyleHeader />
        </View>

        <View style={styles.tabHeader}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === "Canvas" && (
          <>
            <View style={styles.canvas}>
              {selectedItems.map((item, index) => (
                 <DraggableItem
                 key={index}
                 id={item.id}
                 image={item.image}
                 position={item.position}
                 onSavePosition={savePosition}
               />
              ))}
            </View>

            <View style={styles.container}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryBar}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={{ marginRight: 12 }}
                  >
                    <TextButton
                      title={cat}
                      size="small"
                      color="light"
                      onPress={() => setSelectedCategory(cat)}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <FlatList
                data={clothingData.filter(
                  (item) =>
                    selectedCategory === "All" ||
                    item.category === selectedCategory
                )}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ marginRight: 12 }}
                    onPress={() => addToCanvas(item)}
                  >
                    <ItemContainer
                      clothingItem={item.imageUrl || item.image}
                      selectedIds={selectedIds}
                      isSelectable={true}
                      isSelected={selectedIds.includes(item.id)}
                      onSelect={() => toggleSelect(item)}
                      isSolo={true}
                    />
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </>
        )}

        {selectedTab === "Mix & Match" && (
          <View style={styles.container}>
            <ScrollView>
              <OutfitRow title="Tops" data={tops} />
              <OutfitRow title="Bottoms" data={bottoms} />
              <OutfitRow title="Shoes" data={shoes} />
            </ScrollView>
          </View>
        )}

        {selectedTab === "Use AI" && (
          <View style={styles.container}>
            <Text>ai</Text>
          </View>
        )}

        <View style={styles.containerButton}>
          <TextButton
            title="Next"
            size="large"
            color="dark"
            onPress={() => {}}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const OutfitRow = ({ title, data }) => (
  <View style={styles.rowContainer}>
    <Text style={styles.title}>{title}</Text>
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <Image source={item} style={styles.image} />}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    gap: 20,
  },
  containerButton: {
    padding: 16,
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
  bigContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 80,
    position: "relative",
  },
  canvas: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.secondary,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBar: {
    marginBottom: 16,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    borderBottomWidth: 1.25,
    borderColor: theme.colors.accent.grey,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "33.33%",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  tabText: {
    color: theme.colors.text.primary,
  },
  tabTextActive: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  rowContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
  },
  itemImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignContent: "center",
  },
  draggable: {
    position: "absolute",
    width: 200,
    height: 200,
  },
});

export default NewOutfit;
