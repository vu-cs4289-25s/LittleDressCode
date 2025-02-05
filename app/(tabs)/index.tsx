import { registerRootComponent } from 'expo';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import UploadScreen from '../screens/UploadScreen.js';

const App = () => {
  return (
    <View style={styles.container}>
      <UploadScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default registerRootComponent(App);
