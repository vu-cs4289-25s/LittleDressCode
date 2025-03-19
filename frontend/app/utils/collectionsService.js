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
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding collection:", error);
  }
};
