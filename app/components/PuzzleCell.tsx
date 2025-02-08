import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import useColors from '../hooks/useColors';
import useTheme from '../context/ThemeContext';

type PuzzleCellProps = {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'unused';
};

const PuzzleCell: React.FC<PuzzleCellProps> = ({ letter, status }) => {
  const colors = useColors();
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
      margin: CELL_MARGIN,
      borderWidth: 2,
      borderRadius: 4,
      backgroundColor: colors.background[theme],
    },
    empty: {
      borderColor: colors.surface[theme],
    },
    letter: {
      fontSize: CELL_SIZE * 0.6,
      fontWeight: '700',
      color: colors.text[theme],
      textTransform: 'uppercase',
    },
    correct: {
      backgroundColor: colors.correct,
      borderColor: colors.correct,
    },
    present: {
      backgroundColor: colors.present,
      borderColor: colors.present,
    },
    absent: {
      backgroundColor: colors.absent,
      borderColor: colors.absent,
    },
    unused: {
      backgroundColor: colors.surface[theme],
      borderColor: colors.surface[theme],
    },
  });

  return (
    <View style={[
      styles.cell,
      letter ? styles[status] : styles.empty
    ]}>
      <Text style={styles.letter}>{letter.toUpperCase()}</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.min(width / 8, 52);
const CELL_MARGIN = 4;

export default PuzzleCell; 