import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "@/app/utils/firebaseConfig";
import StyleHeader from "@/components/headers/StyleHeader";
import TextButton from "@/components/common/TextButton";

const NewOutfit = () => {
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const q = query(collection(db, "clothingItems"));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const topItems = items.filter((item) => item.category?.includes("Tops"));
        const bottomItems = items.filter((item) => item.category?.includes("Pants") || item.category?.includes("Skirts"));
        const shoeItems = items.filter((item) => item.category?.includes("Shoes"));

        setTops(topItems);
        setBottoms(bottomItems);
        setShoes(shoeItems);
      } catch (err) {
        console.error("❌ Error fetching clothing items:", err);
      }
    };

    fetchClothingItems();
  }, []);

  return (
    <View style={styles.container}>
      <StyleHeader />
      <ScrollView>
        <OutfitRow title="Tops" data={tops} />
        <OutfitRow title="Bottoms" data={bottoms} />
        <OutfitRow title="Shoes" data={shoes} />
      </ScrollView>
      <TextButton title="Next" size="large" color="dark" onPress={() => {}} />
    </View>
  );
};

const OutfitRow = ({ title, data }) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 50,
  },
  rowContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default NewOutfit;
