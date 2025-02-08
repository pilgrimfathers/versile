import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { isSupported, getAnalytics } from 'firebase/analytics';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    auth = getAuth(app);
  }
}

// Initialize Firestore
const db = getFirestore(app);

// Sign in anonymously
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous auth error:", error);
});

// Initialize Analytics only if supported
isSupported().then(yes => yes && getAnalytics(app));

export { app, auth, db }; 