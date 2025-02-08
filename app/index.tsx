import { Stack } from 'expo-router';
import GameScreen from './screens/GameScreen';
import { View } from 'react-native';
import { ThemeProvider } from './context/ThemeContext';

export default function Index() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            title: "Versile",
          }}
        />
        <GameScreen />
      </View>
    </ThemeProvider>
  );
}
