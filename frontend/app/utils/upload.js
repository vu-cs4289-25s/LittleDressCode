import { Alert } from "react-native";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import { removeBackground } from "@/services/backgroundRemove";

// AWS Config
const s3 = new AWS.S3({
  accessKeyId: "AKIA42PHH65MOHVDTVGP",
  secretAccessKey: "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",
  region: "us-east-2",
});

export const uploadImage = async (onUploadSuccess) => {
  if (typeof onUploadSuccess !== "function") {
    console.error("Error: onUploadSuccess is not a function");
    return;
  }

  const handleImagePick = async (fromCamera) => {
    const { status } = await (fromCamera
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync());

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos or camera.");
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
        }));

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      await handleImageUpload(imageUri);
    }
  };

  const handleImageUpload = async (uri) => {
    try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const originalBase64 = Buffer.from(arrayBuffer).toString("base64");
      const fileName = uri.split("/").pop();
  
      // Upload original image to S3
      const s3Url = await new Promise((resolve, reject) => {
        s3.upload(
          {
            Bucket: "upload-test-using-s3",
            Key: fileName,
            Body: Buffer.from(originalBase64, "base64"),
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
            ACL: "public-read",
          },
          (err, data) => {
            if (err) reject(err);
            else {
              console.log("Original upload successful:", data.Location);
              resolve(data.Location);
            }
          }
        );
      });
  
      // Get processed base64 image from remove.bg
      const processedBase64 = await removeBackground(s3Url);
      const processedBody = Buffer.from(
        processedBase64.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
  
      // Overwrite the original S3 image with the processed version
      await new Promise((resolve, reject) => {
        s3.upload(
          {
            Bucket: "upload-test-using-s3",
            Key: fileName,
            Body: processedBody,
            ContentEncoding: "base64",
            ContentType: "image/png",
            ACL: "public-read",
          },
          (err, data) => {
            if (err) reject(err);
            else {
              console.log("Processed image upload successful:", data.Location);
              resolve(data.Location);
            }
          }
        );
      });
  
      onUploadSuccess(`https://upload-test-using-s3.s3.us-east-2.amazonaws.com/${fileName}`);
    } catch (error) {
      console.error("Error during image upload or background removal:", error);
    }
  };
  

  Alert.alert("Upload Image", "Choose an option", [
    { text: "Take a Picture", onPress: () => handleImagePick(true) },
    { text: "Choose from Gallery", onPress: () => handleImagePick(false) },
    { text: "Cancel", style: "cancel" },
  ]);
};
