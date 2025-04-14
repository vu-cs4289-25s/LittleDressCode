import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/app/utils/firebaseConfig';
import theme from '../../styles/theme';

const DeleteButton = ({ 
  itemId, 
  collection, // ✅ Required and must be passed in
  onSuccess,
  onError,
  size = 24,
  color = theme.colors.error, 
  iconStyle,
  buttonStyle 
}) => {
  const handleDelete = async () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to permanently delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              if (!itemId || !collection) {
                throw new Error("Item ID or collection is missing");
              }
              
              await deleteDoc(doc(db, collection, itemId));
              onSuccess?.();
            } catch (error) {
              console.error("Delete failed:", error);
              onError?.(error);
              Alert.alert("Error", "Failed to delete item. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={handleDelete} 
      style={[styles.button, buttonStyle]}
      accessibilityLabel="Delete item"
    >
      <MaterialIcons 
        name="delete" 
        size={size} 
        color={color} 
        style={[styles.icon, iconStyle]} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.backgrounds.secondary,
  },
  icon: {}
});

export default DeleteButton;
