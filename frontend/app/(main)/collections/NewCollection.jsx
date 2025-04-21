import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "@/app/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import theme from "@/styles/theme";
import ItemContainer from "@/components/organization/ItemContainer";
import TextField from "@/components/common/Textfield";
import AccordionView from "@/components/AccordionView";
import { addCollection } from "@/app/utils/collectionsService";
import { useFocusEffect } from "@react-navigation/native";
import BackHeader from "@/components/headers/BackHeader";
import TextButton from "@/components/common/TextButton";
const { width } = Dimensions.get("window");
const OUTFIT_CONTAINER_WIDTH = width * 0.5;

const sections = [
  {
    id: "occasion",
    title: "Occasion",
    buttons: [
      { label: "Casual" },
      { label: "Work" },
      { label: "Formal" },
      { label: "Travel" },
    ],
  },
  {
    id: "season",
    title: "Season",
    buttons: [
      { label: "Spring" },
      { label: "Summer" },
      { label: "Fall" },
      { label: "Winter" },
    ],
  },
];

const NewCollection = () => {
  const { selected } = useLocalSearchParams();
  const selectedIds = JSON.parse(selected || "[]");
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [outfits, setOutfits] = useState([]);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch selected outfits
  const fetchSelectedOutfits = async () => {
    try {
      const snapshot = await getDocs(collection(db, "outfits"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((item) => selectedIds.includes(item.id));
      setOutfits(filtered);
    } catch (err) {
      console.error("Error fetching outfits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId && selectedIds.length > 0) {
        fetchSelectedOutfits();
      }
    }, [userId])
  );

  const onSelectButton = (sectionId, buttonLabel) => {
    setSelectedButtons((prev) => {
      const current = prev[sectionId] || [];
      const alreadySelected = current.includes(buttonLabel);
      return {
        ...prev,
        [sectionId]: alreadySelected
          ? current.filter((label) => label !== buttonLabel)
          : [...current, buttonLabel],
      };
    });
  };

  const handleSave = async () => {
    if (!userId || !name.trim()) {
      console.warn("⚠️ Missing user or collection name");
      return;
    }

    const outfitIds = outfits.map((item) => item.id);
    const tags = [
      ...(selectedButtons["season"] || []),
      ...(selectedButtons["occasion"] || []),
    ];

    try {
      await addCollection(userId, name.trim(), outfitIds, "", tags, true);
      router.replace("/");
    } catch (err) {
      console.error("Error saving collection:", err);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title="New Collection" noPadding={true} />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.outfitsSection}>
          {isLoading ? (
            <Text>Loading outfits...</Text>
          ) : outfits.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.outfitsScrollContent}
              decelerationRate="fast"
              snapToInterval={OUTFIT_CONTAINER_WIDTH + 16}
              snapToAlignment="center"
            >
              {outfits.map((item) => (
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

        <View style={styles.inputWrapper}>
          <TextField
            icon="edit"
            placeholder="Give your collection a name!"
            size="medium"
            onChangeText={setName}
          />
        </View>

        <View style={styles.accordianWrapper}>
          <AccordionView
            title="Tag this Collection"
            sections={sections}
            selectedButtons={selectedButtons}
            onSelectButton={onSelectButton}
          />
        </View>
      </ScrollView>

      <View style={styles.containerButton}>
        <TextButton
          title="Save Collection"
          size="large"
          color="dark"
          onPress={handleSave}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: theme.padding.normal,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 40,
  },
  outfitsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
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
  inputWrapper: {
    marginBottom: 24,
  },
  accordianWrapper: {
    marginBottom: 24,
  },
  containerButton: {
    padding: 16,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 10,
  },
});

export default NewCollection;
