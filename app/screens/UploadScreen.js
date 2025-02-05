// /screens/UploadScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ImageUploader from "../components/ImageUploader";

const UploadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Image to S3</Text>
      <ImageUploader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default UploadScreen;
