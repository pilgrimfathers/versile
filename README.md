# Versile

A daily word game that helps users learn Quranic vocabulary through an engaging Wordle-like experience.

## Features

- Daily puzzle with English translations of Quranic words
- Detailed word information including:
  - Original Arabic text
  - Transliteration
  - Multiple meanings
  - Grammatical information
  - Quranic occurrences with context
- Beautiful and intuitive user interface
- Progress tracking
- Educational insights after each game
- Dark/Light theme support
- Anonymous authentication
- Cross-platform support (iOS, Android, Web)

## Tech Stack

- React Native with Expo
- Firebase/Firestore for backend
- TypeScript for type safety
- Expo Router for navigation
- AsyncStorage for local data persistence

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account
- Firebase CLI (`npm install -g firebase-tools`)
- EAS CLI (`npm install -g eas-cli`) for building

## Firebase Setup

1. Create a new Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Name your project (e.g., "versile")
   - Enable Google Analytics (optional)
   - Click "Create Project"

2. Add a Web app to your Firebase project:
   - In the Firebase Console, click the web icon (</>)
   - Register your app with a nickname (e.g., "versile-web")
   - Copy the Firebase configuration object for later use

3. Enable Firestore:
   - In the Firebase Console, go to "Firestore Database"
   - Click "Create Database"
   - Choose a starting mode (Production or Test)
   - Choose a location
   - Click "Enable"

4. Enable Anonymous Authentication:
   - In the Firebase Console, go to "Authentication"
   - Click "Get Started"
   - Enable "Anonymous" sign-in provider

5. Deploy Firestore Security Rules:
   ```bash
   firebase login
   firebase init
   firebase deploy --only firestore:rules
   ```

6. Initialize the database with sample words:
   ```bash
   node scripts/init-firestore.js
   ```

## Environment Setup

1. Create a `.env` file in the root directory:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd versile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Development

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run reset-project` - Reset project cache and dependencies

## Building

1. Configure EAS Build:
```bash
eas build:configure
```

2. Create a build:
```bash
eas build --platform ios  # For iOS
eas build --platform android  # For Android
eas build --platform web  # For Web
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the original Wordle game
- Built with React Native and Expo
- Uses Firebase for backend services
