import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const HeaderLogo = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/headerLogo.png')}
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
    width: 200,
    height: 100,
    resizeMode: 'contain'
  }
});

export default HeaderLogo; 