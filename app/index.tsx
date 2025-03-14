import { Stack } from 'expo-router';
import { View } from 'react-native';
import IntroScreen from './screens/IntroScreen';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Versile",
          headerShown: true, // Show the header to display the ProfileButton
        }}
      />
      <IntroScreen />
    </View>
  );
}
