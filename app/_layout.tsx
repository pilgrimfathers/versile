import { Stack } from 'expo-router';

import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useColors from './hooks/useColors';
import useTheme from './context/ThemeContext';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Route "./types/index.ts" is missing the required default export',
  'props.pointerEvents is deprecated'
]);

export default function Layout() {
  const colors = useColors();
  const { theme } = useTheme();
  
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.header.background[theme],
          },
          headerTintColor: colors.header.text[theme],
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          contentStyle: {
            backgroundColor: colors.background[theme],
          },
        }}
      />
    </SafeAreaProvider>
  );
}
