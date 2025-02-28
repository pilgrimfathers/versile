import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useColors from './hooks/useColors';
import { ThemeProvider } from './context/ThemeContext';
import useTheme from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Route "./types/index.ts" is missing the required default export',
  'props.pointerEvents is deprecated'
]);

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for actual resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show splash screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}

function LayoutContent() {
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
