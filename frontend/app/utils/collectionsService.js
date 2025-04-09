import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const addCollection = async (
  userId,
  name,
  outfits,
  description,
  category,
  isPublic
) => {
  try {
    const docRef = await addDoc(collection(db, "collections"), {
      userId,
      name,
      outfits: Array.isArray(outfits) ? outfits : [outfits],
      description,
      category: Array.isArray(category) ? category : [category],
      isPublic,
      favorite: false,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding collection:", error);
  }
};

export const updateCollectionFavoriteStatus = async (collectionId, isFavorite) => {
  try {
    const collectionRef = doc(db, "collections", collectionId);
    await updateDoc(collectionRef, {
      favorite: isFavorite,
    });
    console.log(`⭐️ Collection ${collectionId} favorite updated to: ${isFavorite}`);
  } catch (error) {
    console.error("Error updating collection favorite:", error);
  }
};