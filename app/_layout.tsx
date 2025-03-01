import { Stack, router, useRootNavigationState, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useColors from './hooks/useColors';
import { ThemeProvider } from './context/ThemeContext';
import useTheme from './context/ThemeContext';
import LoadingScreen from './components/LoadingScreen';
import InitialLoadingScreen from './components/InitialLoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProfileButton from './components/ProfileButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrateToFirestore, cleanupAsyncStorage } from './utils/migrateToFirestore';

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
    return <InitialLoadingScreen />;
  }
  
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function LayoutContent() {
  const colors = useColors();
  const { theme } = useTheme();
  const { isAuthenticated, isGuest, isLoading, user } = useAuth();
  const [migrationComplete, setMigrationComplete] = useState(false);
  const rootNavigationState = useRootNavigationState();
  
  // Add console logs to debug the state
  console.log('Auth state:', { isAuthenticated, isGuest, isLoading });
  console.log('Navigation state ready:', !!rootNavigationState?.key);
  
  // Use useEffect for navigation to ensure it happens after render
  useEffect(() => {
    if (rootNavigationState?.key && !isLoading && !isAuthenticated && !isGuest) {
      console.log('Redirecting to login screen');
      // Add a small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        router.replace('/screens/login');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [rootNavigationState?.key, isAuthenticated, isGuest, isLoading]);
  
  // Handle migration from AsyncStorage to Firestore
  useEffect(() => {
    const handleMigration = async () => {
      try {
        // Check if migration has already been done
        const migrationDone = await AsyncStorage.getItem('migration_to_firestore_complete');
        
        if (migrationDone !== 'true' && user) {
          // Perform migration
          await migrateToFirestore(user.id, isGuest);
          
          // Mark migration as complete
          await AsyncStorage.setItem('migration_to_firestore_complete', 'true');
          
          // Optional: Clean up AsyncStorage after successful migration
          // Uncomment this line after testing to remove old data
          // await cleanupAsyncStorage();
          
          setMigrationComplete(true);
          console.log('Migration to Firestore completed successfully');
        } else {
          setMigrationComplete(true);
        }
      } catch (error) {
        console.error('Error during migration:', error);
        setMigrationComplete(true); // Still mark as complete to not block the app
      }
    };
    
    if (!isLoading && user) {
      handleMigration();
    } else if (!isLoading) {
      // If no user, still mark migration as complete to not block the app
      setMigrationComplete(true);
    }
  }, [isLoading, user, isGuest]);
  
  if (isLoading || !migrationComplete) {
    return <LoadingScreen />;
  }
  
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
