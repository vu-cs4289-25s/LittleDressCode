import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import TextField from "@/components/common/Textfield";
import AccordionViewEdit from "@/components/AccordionViewEdit";
import TextButton from "@/components/common/TextButton";
import DeleteButton from "@/components/common/DeleteIcon";
import ShareButton from "@/components/buttons/ShareButton";
import theme from "@/styles/theme";
import ItemContainer from "@/components/organization/ItemContainer";

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
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <DeleteButton
          itemId={id}
          collection="collections"
          onSuccess={() => {
            Alert.alert("Collection deleted");
            router.back();
            router.setParams({ refresh: Date.now() });
          }}
          color="black"
          size={26}
          buttonStyle={styles.deleteButton}
        />
        <ShareButton type="collection" id={id} refToCapture={detailRef} />
      </View>

      <ScrollView
        ref={detailRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
        </View>

        <View style={styles.content}>
          <Text style={styles.collectionName}>{name}</Text>

          <View style={styles.nameInputContainer}>
            <TextField
              icon="edit"
              size="large"
              onChangeText={setName}
              value={name}
              placeholder="Edit Collection Name"
            />
          </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgrounds.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 16,
  },
  collectionName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  outfitsSection: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  outfitsScrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  outfitContainer: {
    width: OUTFIT_CONTAINER_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
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
});

export default EditCollectionScreen;