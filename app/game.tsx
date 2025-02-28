import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import GameScreen from './screens/GameScreen';

export default function Game() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Versile",
          headerShown: true, // Show the header to display the ProfileButton
        }}
      />
      <GameScreen />
    </View>
  );
} 