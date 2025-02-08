import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LoaderLogo from './LoaderLogo';
import useColors from '../hooks/useColors';
import useTheme from '../context/ThemeContext';

const LoadingScreen = () => {
  const colors = useColors();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background[theme],
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoWrapper: {
      transform: [{ scale: Platform.OS === 'web' ? 1.5 : 1 }],
      opacity: 0.8,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <LoaderLogo />
      </View>
    </View>
  );
};

export default LoadingScreen; 