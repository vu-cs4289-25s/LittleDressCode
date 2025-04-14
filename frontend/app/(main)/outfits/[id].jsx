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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <DeleteButton
          itemId={id}
          collection="outfits"
          onSuccess={() => {
            Alert.alert("Outfit Deleted");
            router.replace("/outfits");
          }}
          color="black"
          size={26}
          buttonStyle={styles.deleteButton}
        />
        <ShareButton type="outfit" id={id} refToCapture={detailRef} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={detailRef}>
          {/* Outfit images horizontal scroll */}
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

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>{outfitData.name}</Text>
            <TextField
              size="large"
              onChangeText={setName}
              value={name}
              placeholder="Edit outfit name"
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageScrollContainer: {
    height: 160,
    marginBottom: 20,
  },
  horizontalScrollContent: {
    paddingLeft: 16,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 140,
    height: 140,
    marginRight: 12,
  },
  outfitImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  deleteButton: {
    padding: 8,
  },
});

export default OutfitDetail;