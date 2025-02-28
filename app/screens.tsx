import { Redirect, Stack } from 'expo-router';

export default function ScreensLayout() {
  // This layout is used for the /screens/* routes
  // We'll redirect to the main app for now
  return <Redirect href="/" />;
} 