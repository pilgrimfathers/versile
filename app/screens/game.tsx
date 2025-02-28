import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import GameScreen from './GameScreen';

export default function Game() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
        title: "Versile",
        headerShown: true,
      }}
      />
      <GameScreen />
    </View>
  );
} 