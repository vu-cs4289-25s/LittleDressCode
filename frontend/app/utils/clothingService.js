import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

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
