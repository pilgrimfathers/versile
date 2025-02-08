import React from 'react';
import { Text, ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import { Stack } from 'expo-router';
import useTheme from '../context/ThemeContext';
import useColors from '../hooks/useColors';

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background[theme],
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    content: {
      width: '50%',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text[theme],
      textAlign: 'center',
      marginVertical: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text[theme],
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Privacy Policy",
          headerStyle: {
            backgroundColor: colors.header.background[theme],
          },
          headerTintColor: colors.header.text[theme],
        }}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Welcome to Versile. We are committed to protecting your privacy and ensuring you have a positive experience while using our app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.bulletPoint}>• Anonymous user identifier for game progress tracking</Text>
          <Text style={styles.bulletPoint}>• Game statistics and progress</Text>
          <Text style={styles.bulletPoint}>• Device preferences (e.g., theme settings)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information to:
          </Text>
          <Text style={styles.bulletPoint}>• Track your game progress and statistics</Text>
          <Text style={styles.bulletPoint}>• Maintain your game preferences</Text>
          <Text style={styles.bulletPoint}>• Improve the app experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.paragraph}>
            We use Firebase to store your game data securely. Your data is stored according to Firebase's security standards and our strict access controls.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We use the following third-party services:
          </Text>
          <Text style={styles.bulletPoint}>• Firebase (for data storage and authentication)</Text>
          <Text style={styles.bulletPoint}>• Expo (for app functionality)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your game data</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your data</Text>
          <Text style={styles.bulletPoint}>• Opt out of anonymous tracking</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at privacy@versile.app
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Last updated: February 8, 2024
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
} 