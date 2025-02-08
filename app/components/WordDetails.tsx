import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { QuranicWord } from '../types';
import colors from '../constants/colors';
import useTheme from '../context/ThemeContext';

interface WordDetailsProps {
  word: QuranicWord;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = SCREEN_WIDTH * 0.75;

const WordDetails: React.FC<WordDetailsProps> = ({ word, onClose }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.modal.overlay,
    },
    modalView: {
      width: CONTENT_WIDTH,
      maxHeight: '90%',
      backgroundColor: colors.modal.background[theme],
      borderRadius: 15,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      right: 15,
      top: 10,
      zIndex: 1,
    },
    closeButtonText: {
      fontSize: 40,
      color: colors.text[theme],
      lineHeight: 40,
    },
    scrollView: {
      width: '100%',
    },
    scrollContent: {
      padding: 20,
    },
    headerSection: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
      padding: 20,
      backgroundColor: colors.absent,
      borderRadius: 15,
    },
    arabicText: {
      fontSize: 36,
      color: colors.text[theme],
      marginBottom: 10,
    },
    transliteration: {
      fontSize: 20,
      color: colors.surface[theme],
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
    },
    meaningText: {
      color: colors.text[theme],
      fontSize: 16,
    },
    grammarCard: {
      backgroundColor: colors.absent,
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
      color: colors.text[theme],
      fontSize: 14,
      fontWeight: 'bold',
    },
    occurrenceCard: {
      backgroundColor: colors.absent,
      borderRadius: 10,
      marginBottom: 10,
      overflow: 'hidden',
    },
    referenceContainer: {
      backgroundColor: colors.present,
      padding: 10,
    },
    referenceText: {
      color: colors.text[theme],
      fontSize: 16,
      fontWeight: 'bold',
    },
    contextText: {
      color: colors.text[theme],
      fontSize: 14,
      padding: 15,
      fontStyle: 'italic',
    },
  });

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Text style={styles.arabicText}>{word.arabic_word}</Text>
            <Text style={styles.transliteration}>{word.transliteration}</Text>
            <Text style={styles.englishText}>{word.english_translation.toUpperCase()}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meanings</Text>
            <View style={styles.meaningsContainer}>
              {word.meanings.map((meaning, index) => (
                <View key={index} style={styles.meaningChip}>
                  <Text style={styles.meaningText}>{meaning}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grammar</Text>
            <View style={styles.grammarCard}>
              <Text style={styles.grammarText}>Part of Speech: {word.part_of_speech}</Text>
              <Text style={styles.grammarText}>{word.morphological_info}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.frequencyHeader}>
              <Text style={styles.sectionTitle}>Occurrences in Quran</Text>
              <View style={styles.frequencyBadge}>
                <Text style={styles.frequencyText}>{word.frequency} times</Text>
              </View>
            </View>
            {word.occurrences.map((occurrence, index) => (
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
      </View>
    </View>
  );
};

export default WordDetails; 