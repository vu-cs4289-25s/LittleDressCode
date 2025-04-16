import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import AccordionViewEdit from "@/components/AccordionViewEdit";
import ShareButton from "@/components/buttons/ShareButton";
import TextButton from "@/components/common/TextButton";
import TextField from "@/components/common/Textfield";
import DeleteButton from "@/components/common/DeleteIcon";
import InspectHeader from "@/components/headers/InspectHeader";
import theme from "@/styles/theme";

const OutfitDetail = () => {
  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];
  const router = useRouter();

  const [outfitData, setOutfitData] = useState(null);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clothingItems, setClothingItems] = useState([]);
  const [error, setError] = useState(null);
  const detailRef = useRef();
  const [isFavorited, setIsFavorited] = useState(true);

  useEffect(() => {
    setSections([
      {
        id: 3,
        title: "Style",
        buttons: [
          { label: "Casual" },
          { label: "Formal" },
          { label: "Sporty" },
          { label: "Streetwear" },
          { label: "Boho" },
        ],
      },
      {
        id: 4,
        title: "Season",
        buttons: [
          { label: "Spring" },
          { label: "Summer" },
          { label: "Fall" },
          { label: "Winter" },
          { label: "Any" },
        ],
      },
      {
        id: 5,
        title: "Fit",
        buttons: [
          { label: "Tight" },
          { label: "Regular" },
          { label: "Loose" },
          { label: "Oversized" },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        if (!id || typeof id !== "string") {
          setError("No valid outfit ID provided");
          setLoading(false);
          return;
        }

        const docRef = doc(db, "outfits", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setOutfitData(data);
          setName(data.name || "");
          setSelectedButtons({
            3: data.style || [],
            4: data.season || [],
            5: data.fit || [],
          });

          if (data.clothingItems) {
            setClothingItems(
              Array.isArray(data.clothingItems)
                ? data.clothingItems
                : [data.clothingItems]
            );
          }
        } else {
          console.warn("No outfit found with id:", id);
          setError("Outfit not found");
        }
      } catch (err) {
        console.error("Error fetching outfit:", err);
        setError("Failed to load outfit");
      } finally {
        setLoading(false);
      }
    };

    fetchOutfit();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!id) {
        Alert.alert("Error", "No outfit ID available");
        return;
      }

      const docRef = doc(db, "outfits", id);
      await updateDoc(docRef, {
        name,
        style: selectedButtons[3] || [],
        season: selectedButtons[4] || [],
        fit: selectedButtons[5] || [],
      });

      Alert.alert("Saved");
      router.back();
    } catch (err) {
      console.error("Error saving updates:", err);
      Alert.alert("Error", "Failed to update outfit.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading outfit...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TextButton
          title="Go Back"
          size="large"
          color="dark"
          onPress={() => router.back()}
        />
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

  return (
    <View style={styles.bigContainer}>
      <InspectHeader
        id={id}
        ref={detailRef}
        src={clothingItems}
        isFavorited={isFavorited}
        toggleFavorite={handleToggleFavorite}
        isOutfit={true}
      />
      <View style={styles.imageScrollContainer}>
        <FlatList
          horizontal
          data={clothingItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.outfitImage}
                resizeMode="cover"
              />
            </View>
          )}
          contentContainerStyle={styles.horizontalScrollContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View ref={detailRef} style={styles.content}>
            <View style={styles.nameInputContainer}>
              <View style={styles.infoHeader}>
                {outfitData?.name ? (
                  <Text style={styles.inputLabel}>{outfitData.name}</Text>
                ) : (
                  <Text style={styles.inputLabel}>Item Name</Text>
                )}
                <View style={styles.details}>
                  <ShareButton type="closet" id={id} refToCapture={detailRef} />
                  <DeleteButton
                    itemId={id}
                    collection="clothingItems"
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
                placeholder={outfitData ? outfitData.name : "Item name"}
                icon="edit"
              />
            <View style={styles.accordionContainer}>
              <AccordionViewEdit
                sections={sections}
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
    paddingBottom: 40,
  },
  imageScrollContainer: {
    height: 300,
    marginBottom: 20,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  horizontalScrollContent: {
    paddingLeft: 16,
    alignItems: "center",
  },
  imageWrapper: {
    width: 140,
    height: 140,
    marginRight: 12,
  },
  outfitImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  inputLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  accordionContainer: {
    width: "100%",
    marginTop: 16,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 30,
    marginBottom: 30,
  },
  nameInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
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

export default OutfitDetail;
