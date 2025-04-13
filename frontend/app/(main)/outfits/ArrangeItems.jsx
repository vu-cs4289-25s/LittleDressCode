import React, { useRef, useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const ArrangeItems = ({ imageUrls, onCombined }) => {
    const viewRef = useRef();
    const [captured, setCaptured] = useState(false); 
  
    useEffect(() => {
      if (imageUrls.length > 0 && !captured) {
        const timeout = setTimeout(async () => {
          try {
            const uri = await captureRef(viewRef, {
              format: 'jpg',
              quality: 0.9,
            });
            setCaptured(true);
            if (onCombined) onCombined(uri);
          } catch (err) {
            console.error('Capture failed:', err);
          }
        }, 300); 
        return () => clearTimeout(timeout);
      }
    }, [imageUrls, captured]);
  
    return (
      <View style={styles.container} ref={viewRef}>
        {imageUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.image} />
        ))}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      padding: 5,
    },
    image: {
      width: 100,
      height: 100,
      margin: 2,
      borderRadius: 8,
    },
  });

export default ArrangeItems;
