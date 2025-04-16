import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import AccordionViewEdit from "@/components/AccordionViewEdit";
import TextButton from "@/components/common/TextButton";
import TextField from "@/components/common/Textfield";
import InspectHeader from "@/components/headers/InspectHeader";
import theme from "@/styles/theme";
import { MaterialIcons } from "@expo/vector-icons";
import ShareButton from "@/components/buttons/ShareButton";
import DeleteButton from "@/components/common/DeleteIcon";

const ClosetDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [itemData, setItemData] = useState(null);
  const [name, setName] = useState("");
  const [selectedButtons, setSelectedButtons] = useState({});
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setSections([
      {
        id: 1,
        title: "Category",
        buttons: [
          { label: "Tops" },
          { label: "Pants" },
          { label: "Skirts" },
          { label: "Dresses" },
          { label: "Bags" },
          { label: "Shoes" },
          { label: "Outerwear" },
          { label: "Jewelry" },
          { label: "Hats" },
        ],
      },
      {
        id: 2,
        title: "Color",
        buttons: [
          { label: "Red" },
          { label: "Blue" },
          { label: "Black" },
          { label: "White" },
          { label: "Green" },
          { label: "Yellow" },
          { label: "Pink" },
          { label: "Gray" },
          { label: "Brown" },
          { label: "Purple" },
          { label: "Orange" },
          { label: "Multicolor" },
        ],
      },
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
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "clothingItems", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setItemData(data);
          setName(data.name || "");
          setSelectedButtons({
            1: data.category || [],
            2: data.color || [],
            3: data.style || [],
            4: data.season || [],
            5: data.fit || [],
          });
          setIsFavorited(data.favorite);
        } else {
          console.warn("No clothing item found with id:", id);
        }
      } catch (err) {
        console.error("Error fetching clothing item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "clothingItems", id);
      await updateDoc(docRef, {
        name,
        category: selectedButtons[1] || [],
        color: selectedButtons[2] || [],
        style: selectedButtons[3] || [],
        season: selectedButtons[4] || [],
        fit: selectedButtons[5] || [],
      });

      Alert.alert("Saved");
      router.back();
    } catch (err) {
      console.error("Error saving updates:", err);
      Alert.alert("Error", "Failed to update clothing item.");
    }
  };

  if (loading || !itemData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading clothing item...</Text>
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
    <View>
      <InspectHeader
        title={"Edit Item"}
        id={id}
        ref={detailRef}
        isFavorited={isFavorited}
        toggleFavorite={handleToggleFavorite}
      />
      <Image
        source={{ uri: itemData.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View ref={detailRef} style={styles.content}>
            <View style={styles.nameInputContainer}>
              <View style={styles.infoHeader}>
                {itemData?.name ? (
                  <Text style={styles.inputLabel}>{itemData.name}</Text>
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
              placeholder={itemData ? itemData.name : "Item name"}
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
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: theme.colors.backgrounds.secondary,
    padding: 20,
  },
  nameInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  accordionContainer: {
    width: "100%",
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
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

export default ClosetDetail;
