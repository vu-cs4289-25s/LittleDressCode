import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import TextField from "@/components/common/Textfield";
import AccordionViewEdit from "@/components/AccordionViewEdit";
import TextButton from "@/components/common/TextButton";
import DeleteButton from "@/components/common/DeleteIcon";
import ShareButton from "@/components/buttons/ShareButton";
import theme from "@/styles/theme";
import ItemContainer from "@/components/organization/ItemContainer";
import InspectHeader from "@/components/headers/InspectHeader";

const { width } = Dimensions.get("window");
const OUTFIT_CONTAINER_WIDTH = width * 0.8;

const tagSections = [
  {
    id: "occasion",
    title: "Occasion",
    buttons: ["Casual", "Work", "Formal", "Travel"].map((label) => ({ label })),
  },
  {
    id: "season",
    title: "Season",
    buttons: ["Spring", "Summer", "Fall", "Winter"].map((label) => ({ label })),
  },
];

const EditCollectionScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const detailRef = useRef();

  const [collectionData, setCollectionData] = useState(null);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({
    occasion: [],
    season: [],
  });
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const [allOutfits, setAllOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const docRef = doc(db, "collections", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCollectionData({ id: docSnap.id, ...data });
          setName(data.name || "");
          setSelectedOutfits(data.outfits || []);
          setIsFavorited(data.favorite)

          // Initialize selectedButtons with the correct structure
          const tags = data.tags || [];
          setSelectedButtons({
            occasion: tagSections[0].buttons
              .map((b) => b.label)
              .filter((label) => tags.includes(label)),
            season: tagSections[1].buttons
              .map((b) => b.label)
              .filter((label) => tags.includes(label)),
          });
        }
      } catch (err) {
        console.error("Error fetching collection:", err);
        Alert.alert("Error", "Failed to load collection data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchOutfits = async () => {
      try {
        const snapshot = await getDocs(collection(db, "outfits"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllOutfits(data);
      } catch (err) {
        console.error("Error fetching outfits:", err);
      }
    };

    fetchCollection();
    fetchOutfits();
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedTags = [
        ...(selectedButtons["occasion"] || []),
        ...(selectedButtons["season"] || []),
      ];

      await updateDoc(doc(db, "collections", id), {
        name: name.trim(),
        tags: updatedTags,
        outfits: selectedOutfits,
      });

      Alert.alert("Saved", "Your collection has been updated successfully.");
      router.back();
      router.setParams({ refresh: Date.now() }); // Force refresh with timestamp
    } catch (err) {
      console.error("Error saving collection:", err);
      Alert.alert("Error", "Failed to update collection.");
    }
  };

  const outfitObjects = selectedOutfits
    .map((outfitId) => allOutfits.find((o) => o.id === outfitId))
    .filter(Boolean);

  if (loading || !collectionData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading collection...</Text>
      </View>
    );
  }

  const handleToggleFavorite = async () => {
    try {
      const newValue = !isFavorited;
      setIsFavorited(newValue);

      const docRef = doc(db, "clothingItems", id);
      await updateDoc(docRef, {
        favorite: newValue,
      });
    } catch (err) {
      console.error("Failed to update favorite status:", err);
      Alert.alert("Error", "Could not update favorite status.");
    }
  };

  <View style={styles.outfitsSection}>
    {outfitObjects.length > 0 ? (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.outfitsScrollContent}
        decelerationRate="fast"
        snapToInterval={OUTFIT_CONTAINER_WIDTH + 16}
        snapToAlignment="center"
      >
        {outfitObjects.map((item) => (
          <View key={item.id} style={styles.outfitContainer}>
            <ItemContainer
              clothingItem={item}
              isFavorited={false}
              toggleFavorite={() => {}}
              isSelectable={false}
              isSelected={false}
              showControls={false}
              isOutfit={true}
              style={styles.itemContainer}
            />
          </View>
        ))}
      </ScrollView>
    ) : (
      <Text style={styles.noOutfitsText}>No outfits selected</Text>
    )}
  </View>;

  return (
    <View style={styles.bigContainer}>
      <InspectHeader
        isFavorited={isFavorited}
        toggleFavorite={handleToggleFavorite}
      />

      <View style={styles.outfitsSection}>
        {outfitObjects.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.outfitsScrollContent}
            decelerationRate="fast"
            snapToInterval={OUTFIT_CONTAINER_WIDTH + 16}
            snapToAlignment="center"
          >
            {outfitObjects.map((item) => (
              <View key={item.id} style={styles.outfitContainer}>
                <ItemContainer
                  clothingItem={item}
                  isFavorited={false}
                  toggleFavorite={() => {}}
                  isSelectable={false}
                  isSelected={false}
                  showControls={false}
                  isOutfit={true}
                  style={styles.itemContainer}
                  size={400}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noOutfitsText}>No outfits selected</Text>
        )}
      </View>

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View ref={detailRef} style={styles.content}>
            <View style={styles.nameInputContainer}>
              <View style={styles.infoHeader}>
                {collectionData?.name ? (
                  <Text style={styles.inputLabel}>{collectionData.name}</Text>
                ) : (
                  <Text style={styles.inputLabel}>Item Name</Text>
                )}
                <View style={styles.details}>
                  <ShareButton type="closet" id={id} refToCapture={detailRef} />
                  <DeleteButton
                    itemId={id}
                    collection="collections"
                    onSuccess={() => {
                      Alert.alert("Item Deleted");
                      router.back();
                    }}
                    color="black"
                    size={26}
                    buttonStyle={styles.deleteButton}
                  />
                </View>
              </View>
            </View>
            <TextField
              size="large"
              onChangeText={setName}
              value={name}
              placeholder={collectionData ? collectionData.name : "Item name"}
              icon="edit"
            />

            <View style={styles.accordionContainer}>
              <AccordionViewEdit
                sections={tagSections}
                initialTags={selectedButtons}
                onTagChange={setSelectedButtons}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <TextButton
                title="Save Changes"
                size="large"
                color="dark"
                onPress={handleSave}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: theme.padding.normal,
  },
  bigContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  inputLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  collectionName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  outfitsSection: {
    height: 200,
    marginBottom: 15,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  outfitsScrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  outfitContainer: {
    width: OUTFIT_CONTAINER_WIDTH,
    marginRight: 16,
  },
  itemContainer: {
    width: "100%",
    aspectRatio: 1,
  },
  noOutfitsText: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
  nameInputContainer: {
    marginVertical: 16,
  },
  accordionContainer: {
    marginTop: 16,
  },
  buttonWrapper: {
    marginTop: 24,
    marginBottom: 40,
  },
  deleteButton: {
    padding: 8,
  },
  infoHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});

export default EditCollectionScreen;
