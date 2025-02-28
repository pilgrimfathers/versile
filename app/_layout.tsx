import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useColors from './hooks/useColors';
import { ThemeProvider } from './context/ThemeContext';
import useTheme from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProfileButton from './components/ProfileButton';

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
      <AuthProvider>
        <LayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function LayoutContent() {
  const colors = useColors();
  const { theme } = useTheme();
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  
  useEffect(() => {
    // Redirect to login if not authenticated and not in guest mode
    if (!isLoading && !isAuthenticated && !isGuest) {
      router.replace('/screens/LoginScreen');
    }
  }, [isAuthenticated, isGuest, isLoading]);
  
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
          headerRight: () => <ProfileButton />,
          headerTitle: '',
        }}
      />
    </SafeAreaProvider>
  );
}
