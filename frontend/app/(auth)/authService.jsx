import { auth } from "../utils/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Function to Register a User
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error; 
  }
};
