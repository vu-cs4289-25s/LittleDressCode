import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

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
      imageUrl,
      isPublic,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding outfit:", error);
  }
};
