import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GuessResult } from '../types';
import PuzzleCell from './PuzzleCell';

interface PuzzleGridProps {
  guesses: GuessResult[][];
  maxAttempts: number;
  wordLength: number;
  currentGuess: string;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ guesses, maxAttempts, wordLength, currentGuess = '' }) => {
  const renderGrid = () => {
    const grid = [];
    
    // Render previous guesses
    for (let i = 0; i < maxAttempts; i++) {
      const row = [];
      for (let j = 0; j < wordLength; j++) {
        if (i < guesses.length) {
          // Show completed guesses
          const guessResult = guesses[i][j];
          row.push(
            <PuzzleCell
              key={`cell-${i}-${j}`}
              letter={guessResult.letter}
              status={guessResult.status}
            />
          );
        } else if (i === guesses.length) {
          // Show current guess
          const currentLetter = currentGuess.length > j ? currentGuess[j] : '';
          row.push(
            <PuzzleCell
              key={`cell-${i}-${j}`}
              letter={currentLetter}
              status="absent"
            />
          );
        } else {
          // Show empty cells
          row.push(
            <PuzzleCell
              key={`cell-${i}-${j}`}
              letter=""
              status="absent"
            />
          );
        }
      }
      grid.push(
        <View key={`row-${i}`} style={styles.row}>
          {row}
        </View>
      );
    }
    
    return grid;
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>{renderGrid()}</View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const GRID_PADDING = 20;

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    padding: GRID_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PuzzleGrid; 