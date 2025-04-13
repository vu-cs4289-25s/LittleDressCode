import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const DeleteButton = ({ 
  itemId, 
  collectionName = "clothingItems",
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
              const { deleteDoc, doc } = await import('firebase/firestore');
              const { db } = await import('@/app/utils/firebaseConfig');
              await deleteDoc(doc(db, collectionName, itemId));
              onSuccess?.();
            } catch (error) {
              console.error("Delete failed:", error);
              onError?.(error);
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
  icon: {
  }
});

export default DeleteButton;