import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import ShareButton from "@/components/buttons/ShareButton";
import { SafeAreaView } from "react-native";

const ClosetDetail = () => {
  const { id } = useLocalSearchParams();
  const [itemData, setItemData] = useState(null);
  const detailRef = useRef();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "clothingItems", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setItemData(snapshot.data());
        } else {
          console.warn("No clothing item found with id:", id);
        }
      } catch (err) {
        console.error("Error fetching clothing item:", err);
      }
    };

    fetchItem();
  }, [id]);

  if (!itemData) {
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
        <Text style={styles.title}>{itemData.name || "Clothing Item"}</Text>
        <ShareButton type="closet" id={id} refToCapture={detailRef} />
      </View>

      <View ref={detailRef} style={styles.content}>
        <Image
          source={{ uri: itemData.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 32,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
});

export default ClosetDetail;
