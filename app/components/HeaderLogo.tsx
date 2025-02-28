import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';

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
    width: Platform.OS !== 'ios' ? 200 : 100,
    height: Platform.OS !== 'ios' ? 100 : 50,
    resizeMode: 'contain',
    // marginTop: Platform.OS === 'ios' ? 30 : 0,
  }
});

export default HeaderLogo; 