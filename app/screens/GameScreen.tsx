import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Alert, Dimensions, SafeAreaView, Text, TouchableOpacity, Platform } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import PuzzleGrid from '../components/PuzzleGrid';
import Keyboard from '../components/Keyboard';
import WordDetails from '../components/WordDetails';
import IntroModal from '../components/IntroModal';
import { QuranicWord, GuessResult } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import useColors from '../hooks/useColors';
import { Stack } from 'expo-router';

const MAX_ATTEMPTS = 6;
const INTRO_SHOWN_KEY = 'quranic_wordle_intro_shown';

const { width: SCREEN_WIDTH, height } = Dimensions.get('window');
const CONTENT_WIDTH = SCREEN_WIDTH * 0.75; // 75% of screen width

const WORD_LENGTH = 5;

export default GameScreen;

function GameScreen() {
  const [currentWord, setCurrentWord] = useState<QuranicWord | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [letterStates, setLetterStates] = useState<Record<string, GuessResult['status']>>({});
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const colors = useColors();

  useEffect(() => {
    const init = async () => {
      const introShown = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
      if (!introShown) {
        setShowIntro(true);
      }
      fetchDailyWord();
    };
    init();
  }, []);

  const handleIntroClose = async () => {
    setShowIntro(false);
    await AsyncStorage.setItem(INTRO_SHOWN_KEY, 'true');
  };

  const fetchDailyWord = async () => {
    try {
      setLoading(true);
      const wordsRef = collection(db, 'words');
      const querySnapshot = await getDocs(wordsRef);
      
      if (!querySnapshot.empty) {
        // For now, just get the first word
        const wordDoc = querySnapshot.docs[0];
        setCurrentWord({ id: wordDoc.id, ...wordDoc.data() } as QuranicWord);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch word');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameOver || !currentWord) return;

    if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentGuess.length === currentWord.english_translation.length) {
        submitGuess();
      } else {
        Alert.alert('Not enough letters', 'Please complete the word before submitting');
      }
    } else if (currentGuess.length < currentWord.english_translation.length) {
      setCurrentGuess(prev => prev + key.toLowerCase());
    }
  };

  const submitGuess = () => {
    if (!currentWord) return;
    
    const targetWord = currentWord.english_translation.toLowerCase();
    const guessResult: GuessResult[] = [];
    const newLetterStates = { ...letterStates };

    // Calculate guess results
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      if (letter === targetWord[i]) {
        guessResult.push({ letter, status: 'correct' });
        newLetterStates[letter.toUpperCase()] = 'correct';
      } else if (targetWord.includes(letter)) {
        guessResult.push({ letter, status: 'present' });
        if (newLetterStates[letter.toUpperCase()] !== 'correct') {
          newLetterStates[letter.toUpperCase()] = 'present';
        }
      } else {
        guessResult.push({ letter, status: 'absent' });
        newLetterStates[letter.toUpperCase()] = 'absent';
      }
    }

    setGuesses(prev => [...prev, guessResult]);
    setLetterStates(newLetterStates);
    setCurrentGuess('');

    // Check win/lose condition
    if (currentGuess === targetWord) {
      setGameOver(true);
      setShowWordDetails(true);
    } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
      setGameOver(true);
      setShowGameOver(true);
    }
  };

  const handleGameOverClose = () => {
    setShowGameOver(false);
    setShowWordDetails(true);
  };

  if (!currentWord && !loading) return null;

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background[theme],
    },
    container: {
      flex: 1,
      backgroundColor: colors.background[theme],
      alignItems: 'center',
    },
    contentContainer: {
      width: Platform.OS === 'web' ? CONTENT_WIDTH : SCREEN_WIDTH * 0.95,
      flex: 1,
      paddingVertical: 10,
    },
    gridContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      maxHeight: height * 0.65,
      paddingTop: 10,
    },
    keyboardContainer: {
      width: '100%',
      alignItems: 'center',
      paddingBottom: Platform.OS === 'web' ? 10 : 5,
      marginTop: Platform.OS === 'web' ? 20 : 10,
    },
    modalContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.modal.overlay,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.modal.overlay,
    },
    modalView: {
      width: Platform.OS === 'web' ? CONTENT_WIDTH : SCREEN_WIDTH * 0.9,
      backgroundColor: colors.modal.background[theme],
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      right: 15,
      top: 10,
    },
    closeButtonText: {
      fontSize: 40,
      color: colors.text[theme],
      lineHeight: 40,
    },
    gameOverTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text[theme],
      marginBottom: 20,
    },
    answerText: {
      fontSize: 16,
      color: colors.text[theme],
      marginBottom: 10,
    },
    wordText: {
      fontWeight: 'bold',
      color: colors.correct,
    },
    arabicWord: {
      fontSize: 32,
      color: colors.text[theme],
      marginBottom: 10,
      textAlign: 'center',
    },
    transliteration: {
      fontSize: 18,
      color: colors.text[theme],
      marginBottom: 20,
    },
    detailsButton: {
      backgroundColor: colors.correct,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 20,
    },
    detailsButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: "Quranic Wordle",
          headerStyle: {
            backgroundColor: colors.header.background[theme],
          },
          headerTintColor: colors.header.text[theme],
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleTheme} 
              style={{ marginRight: 15 }}
            >
              <Ionicons 
                name={theme === 'light' ? 'moon' : 'sunny'} 
                size={24} 
                color={colors.header.text[theme]} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.gridContainer}>
            <PuzzleGrid
              guesses={guesses}
              maxAttempts={MAX_ATTEMPTS}
              wordLength={WORD_LENGTH}
              currentGuess={currentGuess}
            />
          </View>
          
          <View style={styles.keyboardContainer}>
            <Keyboard
              onKeyPress={handleKeyPress}
              letterStates={letterStates}
            />
          </View>

          <IntroModal
            visible={showIntro}
            onClose={handleIntroClose}
          />

          {/* Game Over Modal */}
          <Modal
            visible={showGameOver}
            animationType="slide"
            transparent={true}
            onRequestClose={handleGameOverClose}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.closeButton} onPress={handleGameOverClose}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>

                <Text style={styles.gameOverTitle}>Game Over!</Text>
                <Text style={styles.answerText}>
                  The word was: <Text style={styles.wordText}>{currentWord?.english_translation.toUpperCase()}</Text>
                </Text>
                <Text style={styles.arabicWord}>{currentWord?.arabic_word}</Text>
                <Text style={styles.transliteration}>{currentWord?.transliteration}</Text>

                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={handleGameOverClose}
                >
                  <Text style={styles.detailsButtonText}>View Word Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Word Details Modal */}
          <Modal
            visible={showWordDetails}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowWordDetails(false)}
          >
            <View style={styles.modalContainer}>
              {currentWord && (
                <WordDetails 
                  word={currentWord} 
                  onClose={() => setShowWordDetails(false)}
                />
              )}
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
} 