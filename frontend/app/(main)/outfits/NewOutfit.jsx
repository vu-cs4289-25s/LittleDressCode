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
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import StyleHeader from "@/components/headers/BackHeader";
import TextButton from "@/components/common/TextButton";
import ItemContainer from "@/components/organization/ItemContainer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Draggable from "react-draggable";
import theme from "@/styles/theme";
import { useRouter } from "expo-router";

// Categories & Tabs
const categories = ["All", "Tops", "Pants", "Shoes", "Jackets"];
const tabs = ["Mix & Match"];
// const tabs = ["Mix & Match", "Canvas"];

const DraggableItem = ({ image, id, position, onSavePosition }) => {
  const handleStop = (e, data) => {
    onSavePosition(id, data.x, data.y);
  };

  return (
    <Draggable position={position} onStop={handleStop}>
      <View style={styles.draggable}>
        <Image source={image} style={styles.itemImage} />
      </View>
    </Draggable>
  );
};

const OutfitRow = ({
  title,
  data,
  category,
  toggleSelectMixAndMatch,
  selectedItems,
}) => (
  <View style={styles.rowContainer}>
    <Text style={styles.title}>{title}</Text>
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => toggleSelectMixAndMatch(item, category)}
        >
          <ItemContainer
            clothingItem={{ uri: item.imageUrl }}
            selectedIds={selectedItems.map((i) => i.id)}
            isSelectable={true}
            isSelected={selectedItems.some(
              (selectedItem) =>
                selectedItem.id === item.id &&
                selectedItem.category === category
            )}
            onSelect={() => toggleSelectMixAndMatch(item, category)}
            isSolo={true}
            size={150}
          />
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
  </View>
);

const NewOutfit = () => {
  const [selectedTab, setSelectedTab] = useState("Mix & Match");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [clothingData, setClothingData] = useState([]);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [shoes, setShoes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const q = query(collection(db, "clothingItems"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClothingData(items);
        setTops(items.filter((item) => item.category?.includes("Tops")));
        setBottoms(
          items.filter(
            (item) =>
              item.category?.includes("Pants") ||
              item.category?.includes("Skirts")
          )
        );
        setShoes(items.filter((item) => item.category?.includes("Shoes")));
      } catch (err) {
        console.error("❌ Error fetching clothing items:", err);
      }
    };

    fetchClothingItems();
  }, []);

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

  // For Canvas
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

  // For Mix&Match
  const toggleSelectMixAndMatch = (item, category) => {
    const isAlreadySelected = selectedItems.some(
      (selectedItem) =>
        selectedItem.id === item.id && selectedItem.category === category
    );

    if (isAlreadySelected) {
      setSelectedItems((prevItems) =>
        prevItems.filter(
          (selectedItem) =>
            !(selectedItem.id === item.id && selectedItem.category === category)
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, category }]);
    }
  };

  const selectItem = (category, item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: item,
    }));
  };

  const savePosition = (id, x, y, rotation) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, position: { x, y }, rotation } : item
      )
    );
  };

  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <StyleHeader title={"Styling"} />
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
            {/* {selectedItems.map((item, index) => (
                <DraggableItem
                  key={index}
                  id={item.id}
                  image={{ uri: item.imageUrl }}
                  position={item.position}
                  onSavePosition={savePosition}
                />
              ))} */}
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
                    clothingItem={{ uri: item.imageUrl }}
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
            <OutfitRow
              title="Tops"
              data={tops}
              category="Tops"
              toggleSelectMixAndMatch={toggleSelectMixAndMatch}
              selectedItems={selectedItems}
            />
            <OutfitRow
              title="Bottoms"
              data={bottoms}
              category="Bottoms"
              toggleSelectMixAndMatch={toggleSelectMixAndMatch}
              selectedItems={selectedItems}
            />
            <OutfitRow
              title="Shoes"
              data={shoes}
              category="Shoes"
              toggleSelectMixAndMatch={toggleSelectMixAndMatch}
              selectedItems={selectedItems}
            />
          </ScrollView>
        </View>
      )}

      <View style={styles.containerButton}>
        <TextButton
          title="Next"
          size="large"
          color="dark"
          onPress={() => {
            router.push({
              pathname: "outfits/OutfitCompletion",
              params: { selectedItems: JSON.stringify(selectedItems) },
            });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  containerButton: {
    padding: 16,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  bigContainer: {
    flex: 1,
    backgroundColor: "white",
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
    marginBottom: 25,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    // width: "50%", set depending on number of tabs
    width: "100%",
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
    flexDirection: "column",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    paddingLeft: 32,
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
