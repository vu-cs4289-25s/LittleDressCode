import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

// Function to create an outfit
export const addOutfit = async (
  userId,
  name,
  clothingItems,
  category,
  season,
  style,
  fit,
  imageUrl,
  isPublic
) => {
  try {
    const docRef = await addDoc(collection(db, "outfits"), {
      userId,
      name,
      clothingItems: Array.isArray(clothingItems)
        ? clothingItems
        : [clothingItems],
      category: Array.isArray(category) ? category : [category],
      season: Array.isArray(season) ? season : [season],
      style: Array.isArray(style) ? style : [style],
      fit: Array.isArray(fit) ? fit : [fit],
      imageUrl, // UPDATE LATER FOR COMBINED IMAGE?
      isPublic,
      favorite: false,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding outfit:", error);
  }
};

export const getFilteredOutfits = async (userId, selectedFilters) => {
  try {
    const q = query(
      collection(db, "outfits"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const allOutfits = [];
    querySnapshot.forEach((doc) => {
      allOutfits.push({ id: doc.id, ...doc.data() });
    });

    if (selectedFilters.length === 0) return allOutfits;

    // ✅ Handle "Favorited" as a filter
    const isFilteringFavorites = selectedFilters.includes("Favorited");
    const tagFilters = selectedFilters.filter((f) => f !== "Favorited");

    const filtered = allOutfits.filter((outfit) => {
      const tags = [
        ...(outfit.category || []),
        ...(outfit.season || []),
        ...(outfit.style || []),
        ...(outfit.fit || []),
      ];

      const matchesTags = tagFilters.every((filter) => tags.includes(filter));
      const matchesFavorite = isFilteringFavorites
        ? outfit.favorite === true
        : true;

      return matchesTags && matchesFavorite;
    });

    return filtered;
  } catch (error) {
    console.error("Error fetching filtered outfits:", error);
    return [];
  }
};

export const updateOutfitFavoriteStatus = async (outfitId, isFavorite) => {
  try {
    const outfitRef = doc(db, "outfits", outfitId);
    await updateDoc(outfitRef, {
      favorite: isFavorite,
    });
    console.log(`💖 Outfit ${outfitId} favorite updated to: ${isFavorite}`);
  } catch (error) {
    console.error("Error updating outfit favorite:", error);
  }
};