import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";

interface UploadProps {
  onUploadSuccess: (imageUrl: string) => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);

  // AWS S3 configuration
  const s3 = new AWS.S3({
    accessKeyId: "AKIA42PHH65MOHVDTVGP",
    secretAccessKey: "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",
    region: "us-east-2",
  });

  const handleImagePick = async (fromCamera: boolean) => {
    const { status } = await (fromCamera
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync()
    );

    if (status !== "granted") {
      alert("Sorry, we need permissions to access your camera and photos!");
      return;
    }

    const result = await (fromCamera
      ? ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
      : ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
    );

    if (!result.canceled) {
      setLoading(true);
      const imageUri = result.assets[0].uri;
      uploadImageToS3(imageUri);
    }
  };

  const uploadImageToS3 = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const hash = uri.substring(uri.lastIndexOf("/") + 1);

      const params: AWS.S3.PutObjectRequest = {
        Bucket: "upload-test-using-s3",
        Key: `${hash}.jpg`,
        ContentType: "image/jpeg",
        Body: blob,
      };

      s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        setLoading(false);
        if (err) {
          console.error("Error uploading to S3:", err);
        } else {
          console.log("Upload successful:", data.Location);
          onUploadSuccess(data.Location);
        }
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  const showUploadOptions = () => {
    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        { text: "Take a Picture", onPress: () => handleImagePick(true) },
        { text: "Choose from Gallery", onPress: () => handleImagePick(false) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.uploadButton}
      onPress={showUploadOptions}
      disabled={loading}
    >
      <Text style={styles.uploadText}>{loading ? "..." : "+"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  uploadText: {
    fontSize: 30,
    color: "#fff",
  },
});

export default Upload;
