import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal } from 'react-native';
import colors from '../constants/colors';
import useTheme from '../context/ThemeContext';

interface PrivacyPolicyProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web'
  ? (Platform.select({
      web: SCREEN_WIDTH > 768 ? SCREEN_WIDTH * 0.35 : SCREEN_WIDTH * 0.95
    }))
  : SCREEN_WIDTH * 0.9;

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      backgroundColor: colors.modal.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalView: {
      width: CONTENT_WIDTH,
      backgroundColor: colors.modal.background[theme],
      borderRadius: 15,
      padding: Platform.OS === 'web' ? 20 : 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      maxHeight: '80%',
    },
    scrollContent: {
      paddingHorizontal: 15,
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1,
      padding: 5,
    },
    closeButtonText: {
      fontSize: 28,
      color: colors.text[theme],
      lineHeight: 28,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text[theme],
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text[theme],
      marginTop: 15,
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 14,
      color: colors.text[theme],
      marginBottom: 10,
      lineHeight: 20,
    },
    bulletPoint: {
      fontSize: 14,
      color: colors.text[theme],
      marginBottom: 8,
      marginLeft: 15,
      lineHeight: 20,
    },
    lastUpdated: {
      fontSize: 12,
      color: colors.text[theme],
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 10,
      fontStyle: 'italic',
    }
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <ScrollView style={{ pointerEvents: 'auto' }} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Privacy Policy</Text>

            <Text style={styles.paragraph}>
              Welcome to Versile. We are committed to protecting your privacy and ensuring you have a positive experience while using our app.
            </Text>

            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.bulletPoint}>• Anonymous user identifier for game progress tracking</Text>
            <Text style={styles.bulletPoint}>• Game statistics and progress</Text>
            <Text style={styles.bulletPoint}>• Device preferences (e.g., theme settings)</Text>

            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the collected information to:
            </Text>
            <Text style={styles.bulletPoint}>• Track your game progress and statistics</Text>
            <Text style={styles.bulletPoint}>• Maintain your game preferences</Text>
            <Text style={styles.bulletPoint}>• Improve the app experience</Text>

            <Text style={styles.sectionTitle}>Data Storage</Text>
            <Text style={styles.paragraph}>
              We use Firebase to store your game data securely. Your data is stored according to Firebase's security standards and our strict access controls.
            </Text>

            <Text style={styles.sectionTitle}>Third-Party Services</Text>
            <Text style={styles.paragraph}>
              We use the following third-party services:
            </Text>
            <Text style={styles.bulletPoint}>• Firebase (for data storage and authentication)</Text>
            <Text style={styles.bulletPoint}>• Expo (for app functionality)</Text>

            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:
            </Text>
            <Text style={styles.bulletPoint}>• Access your game data</Text>
            <Text style={styles.bulletPoint}>• Request deletion of your data</Text>
            <Text style={styles.bulletPoint}>• Opt out of anonymous tracking</Text>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us at privacy@versile.app
            </Text>

            <Text style={styles.lastUpdated}>
              Last updated: February 8, 2024
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyPolicy; 