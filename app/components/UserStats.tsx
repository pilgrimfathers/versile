import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '../types';
import useColors from '../hooks/useColors';
import useTheme from '../context/ThemeContext';

interface UserStatsProps {
  user: User;
}

const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  const colors = useColors();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.surface[theme],
      borderRadius: 15,
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      color: colors.text[theme],
    },
    value: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text[theme],
    },
    streak: {
      color: colors.correct,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Current Streak</Text>
        <Text style={[styles.value, styles.streak]}>{user.streak}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Words Guessed</Text>
        <Text style={styles.value}>{user.guessed_words.length}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Last Played</Text>
        <Text style={styles.value}>
          {user.last_played ? new Date(user.last_played).toLocaleDateString() : 'Never'}
        </Text>
      </View>
    </View>
  );
};

export default UserStats; 