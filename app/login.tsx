import { Stack } from 'expo-router';
import { View } from 'react-native';
import LoginScreen from './screens/LoginScreen';

export default function Login() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Login",
          headerShown: false, // Hide the header on the login screen
        }}
      />
      <LoginScreen />
    </View>
  );
} 