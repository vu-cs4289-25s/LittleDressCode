import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AWS from 'aws-sdk';
import md5 from 'react-native-md5';

const UploadScreen = () => {
  const [image, setImage] = useState<string | null>(null);

  // Need to configure AWS S3
  const s3 = new AWS.S3({
    accessKeyId: "AKIA42PHH65MOHVDTVGP",
    secretAccessKey: "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",
    region: "us-east-2"
  });

  // Function to handle image picking
  const pickImage = async (fromCamera: boolean) => {
    // Request permissions dynamically
    const { status } = await (fromCamera 
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync()
    );

    if (status !== 'granted') {
      alert('Sorry, we need permissions to access your camera and photos!');
      return;
    }

    // Launch either the camera or gallery
    let result = await (fromCamera 
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
      setImage(result.assets[0].uri);
      uploadImageToS3(result.assets[0].uri);
    }
  };

  // Function to upload the image to S3
  const uploadImageToS3 = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate a unique MD5 hash for the file name
      const hash = md5.hex_md5(uri);
      console.log("Generated MD5 Hash:", hash);

      // Define S3 upload parameters
      const params: AWS.S3.PutObjectRequest = {
        Bucket: "upload-test-using-s3",
        Key: `${hash}.jpg`,
        ContentType: 'image/jpeg',
        Body: blob, 
      };

      // Upload the image to S3
      s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
        if (err) {
          console.error('Error uploading to S3:', err);
        } else {
          console.log('Upload successful:', data.Location);
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={() => pickImage(true)} />
      <Button title="Pick from Gallery" onPress={() => pickImage(false)} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default UploadScreen;
