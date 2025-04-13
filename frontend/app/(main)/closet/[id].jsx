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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import AccordionViewEdit from "@/components/AccordionViewEdit";
import ShareButton from "@/components/buttons/ShareButton";
import TextButton from "@/components/common/TextButton";
import TextField from "@/components/common/Textfield";
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <DeleteButton
          itemId={id}
          onSuccess={() => {
            Alert.alert("Item Deleted");
            router.back();
          }}
          color="black"
          size={26}
          buttonStyle={styles.deleteButton}
        />
        <ShareButton type="closet" id={id} refToCapture={detailRef} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View ref={detailRef} style={styles.content}>
          <Image
            source={{ uri: itemData.imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.nameInputContainer}>
            {itemData?.name ? (
              <Text style={styles.inputLabel}>{itemData.name}</Text>
            ) : (
              <Text style={styles.inputLabel}>Item Name</Text>
            )}
            <TextField
              size="large"
              onChangeText={setName}
              value={name}
              placeholder="Edit item name"
            />
          </View>

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
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  nameInputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
});

export default ClosetDetail;
