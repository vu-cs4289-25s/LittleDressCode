import { db } from "./firebaseConfig";
import { auth } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

// Remove the addCustomTag function - we don't need it anymore
export const addClothingItem = async (
  userId,
  name,
  category,
  color,
  style,
  season,
  fit,
  imageUrl,
  favorite
) => {
  try {
    console.log("Submitting as:", userId);
    console.log("Current auth UID:", auth.currentUser?.uid);

    const docRef = await addDoc(collection(db, "clothingItems"), {
      userId,
      name,
      category: Array.isArray(category) ? category : [category],
      color: Array.isArray(color) ? color : [color],
      style: Array.isArray(style) ? style : [style],
      season: Array.isArray(season) ? season : [season],
      fit: Array.isArray(fit) ? fit : [fit],
      imageUrl,
      favorite: false,
      outfits: [],
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.log("Submitting as:", userId);
    console.log("Current auth UID:", auth.currentUser?.uid);

    console.error("Error adding clothing item:", error);
    throw error;
  }
};

export const updateFavoriteStatus = async (itemId, isFavorite) => {
  console.log("🧪 updateFavoriteStatus called with:", { itemId, isFavorite });
  try {
    const itemRef = doc(db, "clothingItems", itemId);
    await updateDoc(itemRef, {
      favorite: isFavorite,
    });
    console.log(`Favorite updated to ${isFavorite} for ${itemId}`);
  } catch (error) {
    console.error("Error updating favorite:", error);
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

    // ✅ Handle "Favorited" as a filter
    const isFilteringFavorites = selectedFilters.includes("Favorited");
    const tagFilters = selectedFilters.filter((f) => f !== "Favorited");

    const filtered = allItems.filter((item) => {
      // Collect the tags from the item (category, color, etc.)
      const tags = [
        ...(item.category || []),
        ...(item.color || []),
        ...(item.style || []),
        ...(item.season || []),
        ...(item.fit || []),
      ];

      // Check if the item matches any selected filter
      const matchesTags = tagFilters.length > 0 ? tagFilters.some((filter) => tags.includes(filter)) : true;

      // Check if the item matches the favorite filter (if selected)
      const matchesFavorite = isFilteringFavorites ? item.favorite === true : true;

      // Return items that match at least one filter
      return matchesTags && matchesFavorite;
    });

    return filtered;
  } catch (error) {
    console.error("Error fetching filtered clothing items:", error);
    return [];
  }
};


