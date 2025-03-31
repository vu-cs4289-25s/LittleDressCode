import { db } from "./firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";


export const addClothingItem = async (
  userId,
  name,
  category,
  color,
  style,
  season,
  fit,
  imageUrl
) => {
  try {
    const docRef = await addDoc(collection(db, "clothingItems"), {
      userId,
      name,
      category: Array.isArray(category) ? category : [category],
      color: Array.isArray(color) ? color : [color],
      style: Array.isArray(style) ? style : [style],
      season: Array.isArray(season) ? season : [season],
      fit: Array.isArray(fit) ? fit : [fit],
      imageUrl,
      outfits: [], // Initialize empty array
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding clothing item:", error);
  }
};

export const getFilteredClothingItems = async (userId, selectedFilters) => {
  try {
    const q = query(
      collection(db, "clothingItems"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const allItems = [];
    querySnapshot.forEach((doc) => {
      allItems.push({ id: doc.id, ...doc.data() });
    });

    if (selectedFilters.length === 0) return allItems;

    // Apply client-side filter matching against tags
    const filtered = allItems.filter((item) => {
      const tags = [
        ...(item.category || []),
        ...(item.color || []),
        ...(item.style || []),
        ...(item.season || []),
        ...(item.fit || []),
      ];

      return selectedFilters.every((filter) => tags.includes(filter));
    });

    return filtered;
  } catch (error) {
    console.error("Error fetching filtered clothing items:", error);
    return [];
  }
};
