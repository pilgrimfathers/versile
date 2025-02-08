import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const LoaderLogo = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/icon.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  }
});

export default LoaderLogo; 