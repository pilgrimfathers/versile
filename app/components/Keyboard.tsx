import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { GuessResult } from '../types';
import useColors from '../hooks/useColors';
import useTheme from '../context/ThemeContext';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, GuessResult['status']>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStates }) => {
  const colors = useColors();
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    keyboard: {
      width: CONTENT_WIDTH,
      padding: Platform.OS === 'web' ? 10 : 5,
      backgroundColor: colors.background[theme],
      paddingHorizontal: Platform.OS === 'web' ? 20 : 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 8,
      paddingHorizontal: Platform.OS === 'web' ? 10 : 5,
    },
    key: {
      width: KEY_WIDTH,
      height: Platform.OS === 'web' ? 58 : 50,
      margin: Platform.OS === 'web' ? 3 : 2,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.key.background[theme],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
    specialKey: {
      width: KEY_WIDTH * 1.5,
    },
    keyText: {
      fontSize: Platform.OS === 'web' ? 14 : 13,
      fontWeight: '600',
      color: colors.key.text[theme],
    },
    correct: {
      backgroundColor: colors.correct,
    },
    present: {
      backgroundColor: colors.present,
    },
    absent: {
      backgroundColor: colors.absent,
    },
    unused: {
      backgroundColor: colors.key.background[theme],
    },
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (event: KeyboardEvent) => {
        let key = event.key.toUpperCase();
        
        // Handle special keys
        if (key === 'ENTER' || key === 'BACKSPACE') {
          event.preventDefault();
          onKeyPress(key === 'BACKSPACE' ? '⌫' : 'ENTER');
          return;
        }
        
        // Handle letter keys
        if (/^[A-Z]$/.test(key)) {
          event.preventDefault();
          onKeyPress(key);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [onKeyPress]);

  const renderKey = (key: string) => {
    const isSpecialKey = key === 'ENTER' || key === '⌫';
    const status = letterStates[key] || 'unused';
    
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.key,
          isSpecialKey && styles.specialKey,
          status !== 'unused' ? styles[status] : styles.unused,
        ]}
        onPress={() => onKeyPress(key)}
      >
        <Text style={styles.keyText}>{key}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.keyboard}>
      {KEYBOARD_LAYOUT.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map(renderKey)}
        </View>
      ))}
    </View>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? SCREEN_WIDTH * 0.75 : SCREEN_WIDTH * 0.95;
const KEY_WIDTH = Platform.OS === 'web' 
  ? (CONTENT_WIDTH - 100) / 10 
  : (CONTENT_WIDTH - 50) / 10;

export default Keyboard; 