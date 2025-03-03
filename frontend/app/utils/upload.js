import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";

// Configure AWS S3
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
      Alert.alert(
        "Permission Denied",
        "We need camera/gallery access to upload images."
      );
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
      await uploadImageToS3(imageUri);
    }
  };

  const uploadImageToS3 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = uri.split("/").pop();

      const params = {
        Bucket: "upload-test-using-s3",
        Key: `${fileName}.jpg`,
        ContentType: "image/jpeg",
        Body: blob,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading to S3:", err);
          Alert.alert("Upload Failed", "Something went wrong while uploading.");
        } else {
          console.log("Upload successful:", data.Location);
          onUploadSuccess(data.Location);
        }
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  Alert.alert("Upload Image", "Choose an option", [
    { text: "Take a Picture", onPress: () => handleImagePick(true) },
    { text: "Choose from Gallery", onPress: () => handleImagePick(false) },
    { text: "Cancel", style: "cancel" },
  ]);
};
