import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Alert, Dimensions, SafeAreaView, Text, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import PuzzleGrid from '../components/PuzzleGrid';
import Keyboard from '../components/Keyboard';
import IntroModal from '../components/IntroModal';
import { QuranicWord, GuessResult } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import useColors from '../hooks/useColors';
import { Stack } from 'expo-router';
import useUserProgress from '../hooks/useUserProgress';
import UserStats from '../components/UserStats';
import HeaderLogo from '../components/HeaderLogo';
import { getTodayWordIndex } from '../utils/wordIndex';
import { STORAGE_KEYS } from '../constants/storage';
import PrivacyPolicy from '../components/PrivacyPolicy';

const MAX_ATTEMPTS = 6;
const INTRO_SHOWN_KEY = 'quranic_wordle_intro_shown';

const { width, height } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' 
  ? (Platform.select({
      web: width > 768 ? width * 0.75 : width * 0.95
    }))
  : width * 0.95;

const WORD_LENGTH = 5;

interface GameState {
  guesses: GuessResult[][];
  letterStates: Record<string, GuessResult['status']>;
  gameOver: boolean;
  showWordDetails: boolean;
}

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
  const [isPlayedStatusLoaded, setIsPlayedStatusLoaded] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const colors = useColors();
  const { user, loading: userLoading, updateUserProgress } = useUserProgress();

  useEffect(() => {
    const init = async () => {
      try {
        const introShown = await AsyncStorage.getItem(INTRO_SHOWN_KEY);
        if (!introShown) {
          setShowIntro(true);
        }
        
        // Check if user has already played today
        const played = await hasPlayedToday();
        
        // Load saved game state if it exists and hasn't been played today
        if (!played) {
          const savedState = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
          if (savedState) {
            const state = JSON.parse(savedState) as GameState;
            setGuesses(state.guesses);
            setLetterStates(state.letterStates);
            setGameOver(state.gameOver);
            setShowWordDetails(state.showWordDetails);
          }
        } else {
          // If already played today, clear the state
          await AsyncStorage.removeItem(STORAGE_KEYS.GAME_STATE);
          setGuesses([]);
          setLetterStates({});
          setGameOver(false);
          setShowWordDetails(false);
        }
        
        // Then fetch daily word
        fetchDailyWord();
      } catch (error) {
        console.error('Error during initialization:', error);
      }
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
      
      // Check if user has already played today
      const played = await hasPlayedToday();
      
      // Get today's word index
      const todayIndex = getTodayWordIndex();
      
      // Query Firestore for word with matching index
      const wordsRef = collection(db, 'words');
      const q = query(wordsRef, where('index', '==', todayIndex));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const wordDoc = querySnapshot.docs[0];
        const word = { id: wordDoc.id, ...wordDoc.data() } as QuranicWord;
        setCurrentWord(word);
        
        if (played) {
          setGameOver(true);
          setShowWordDetails(true);
        }
      } else {
        console.error('No word found for today');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch word');
    } finally {
      setLoading(false);
      setIsPlayedStatusLoaded(true);
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

  const submitGuess = async () => {
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

    const newGuesses = [...guesses, guessResult];
    setGuesses(newGuesses);
    setLetterStates(newLetterStates);
    setCurrentGuess('');

    // Save game state immediately
    const gameState: GameState = {
      guesses: newGuesses,
      letterStates: newLetterStates,
      gameOver: false,
      showWordDetails: false
    };
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));

    // Check win/lose condition
    const todayIndex = getTodayWordIndex();
    const isCorrectWord = currentWord.index === todayIndex && currentGuess === targetWord;

    if (isCorrectWord || newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      const success = isCorrectWord;
      
      await updateUserProgress(currentWord.id, newGuesses.length, success);
      await markAsPlayed();
      
      if (success) {
        setShowWordDetails(true);
      } else {
        setShowGameOver(true);
      }
    }
  };

  const handleGameOverClose = () => {
    setShowGameOver(false);
    setShowWordDetails(true);
  };

  const hasPlayedToday = async () => {
    try {
      const lastPlayed = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAYED_DATE);
      if (!lastPlayed) return false;
      
      const today = new Date().toISOString().split('T')[0];
      return lastPlayed === today;
    } catch (error) {
      console.error('Error checking last played date:', error);
      return false;
    }
  };

  const markAsPlayed = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAYED_DATE, today);
    } catch (error) {
      console.error('Error marking as played:', error);
    }
  };

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
      width: CONTENT_WIDTH,
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
      width: CONTENT_WIDTH,
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
    wordDetailsContainer: {
      flex: 1,
      padding: 20,
    },
    headerSection: {
      alignItems: 'center',
      marginBottom: 30,
      padding: 20,
      backgroundColor: colors.surface[theme],
      borderRadius: 15,
    },
    arabicText: {
      fontSize: 36,
      color: colors.text[theme],
      marginBottom: 10,
    },
    englishText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.correct,
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text[theme],
      marginBottom: 15,
    },
    meaningsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    meaningChip: {
      backgroundColor: colors.present,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      margin: 4,
    },
    meaningText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    grammarCard: {
      backgroundColor: colors.surface[theme],
      padding: 15,
      borderRadius: 10,
    },
    grammarText: {
      color: colors.text[theme],
      fontSize: 16,
      marginBottom: 5,
    },
    frequencyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    frequencyBadge: {
      backgroundColor: colors.correct,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    frequencyText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    },
    occurrenceCard: {
      backgroundColor: colors.surface[theme],
      borderRadius: 10,
      marginBottom: 10,
      overflow: 'hidden',
    },
    referenceContainer: {
      backgroundColor: colors.present,
      padding: 10,
    },
    referenceText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    contextText: {
      color: colors.text[theme],
      fontSize: 14,
      padding: 15,
      fontStyle: 'italic',
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    privacyLink: {
      color: colors.present,
      textAlign: 'center',
      fontSize: 14,
      padding: 10,
    },
  });

  if (!currentWord || loading || !isPlayedStatusLoaded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            headerTitle: () => <HeaderLogo />,
            headerStyle: {
              backgroundColor: colors.header.background[theme],
            },
            headerTintColor: colors.header.text[theme],
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
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.correct} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderLogo />,
          headerStyle: {
            backgroundColor: colors.header.background[theme],
          },
          headerTintColor: colors.header.text[theme],
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
          {gameOver && currentWord ? (
            <ScrollView style={styles.wordDetailsContainer}>
              {user && <UserStats user={user} />}
              <View style={styles.headerSection}>
                <Text style={styles.arabicText}>{currentWord.arabic_word}</Text>
                <Text style={styles.transliteration}>{currentWord.transliteration}</Text>
                <Text style={styles.englishText}>{currentWord.english_translation.toUpperCase()}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meanings</Text>
                <View style={styles.meaningsContainer}>
                  {currentWord.meanings.map((meaning, index) => (
                    <View key={index} style={styles.meaningChip}>
                      <Text style={styles.meaningText}>{meaning}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Grammar</Text>
                <View style={styles.grammarCard}>
                  <Text style={styles.grammarText}>Part of Speech: {currentWord.part_of_speech}</Text>
                  <Text style={styles.grammarText}>{currentWord.morphological_info}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.frequencyHeader}>
                  <Text style={styles.sectionTitle}>Occurrences in Quran</Text>
                  <View style={styles.frequencyBadge}>
                    <Text style={styles.frequencyText}>{currentWord.frequency} times</Text>
                  </View>
                </View>
                {currentWord.occurrences.map((occurrence, index) => (
                  <View key={index} style={styles.occurrenceCard}>
                    <View style={styles.referenceContainer}>
                      <Text style={styles.referenceText}>
                        Surah {occurrence.surah}:{occurrence.ayah}
                      </Text>
                    </View>
                    <Text style={styles.contextText}>{occurrence.context}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <>
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
            </>
          )}

          <IntroModal
            visible={showIntro}
            onClose={handleIntroClose}
          />

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
        </View>
        <Text style={styles.privacyLink} onPress={() => setShowPrivacyPolicy(true)}>Privacy Policy</Text>
      </View>
      <PrivacyPolicy
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </SafeAreaView>
  );
} 