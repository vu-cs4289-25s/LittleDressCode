// /components/ImageUploader.js
import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { pickImage } from "../utils/imagePicker";
import { uploadToS3 } from "../services/s3Service";

const ImageUploader = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    const uri = await pickImage();
    if (!uri) return;

    setImageUri(uri);
    setUploading(true);

    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `upload-${Date.now()}.jpg`;

    try {
      const s3Url = await uploadToS3(blob, fileName);
      console.log("Uploaded to S3:", s3Url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick and Upload Image" onPress={handleImageUpload} />
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default ImageUploader;
