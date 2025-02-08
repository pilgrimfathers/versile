# Versile App - Project Context

## Overview

The Versile App is an educational game that challenges users to guess English translations of Quranic words. Upon a correct guess, the app provides:

- **Occurrences in the Quran:** Surah and ayah references with context snippets.
- **Word Details:** Meanings, transliterations, frequency, and morphological information.

The aim is to enhance users' familiarity with Quranic vocabulary through engaging gameplay.

## Objectives

- **Educational Engagement:** Combine learning with interactive gameplay to deepen understanding of Quranic vocabulary.
- **Comprehensive Insights:** Offer detailed information about each word, including its occurrences and linguistic features.

## Features

### Core Game Mechanics

- **Daily Puzzle:** Present users with a new English-translated Quranic word to guess each day.
- **Guessing Interface:** Users input guesses, receiving feedback on accuracy and letter placement, similar to Wordle mechanics.
- **Completion Feedback:** Upon a correct guess, display detailed information about the word.

### User Onboarding

- **Introductory Modal:** On the first app launch, display a modal explaining the game rules and mechanics using React Native's `<Modal>` component.

### Post-Guess Details

- **Occurrences Display:** List all verses where the word appears, including:
  - Surah name and number.
  - Ayah number.
  - Contextual excerpt of the verse.
- **Word Details Panel:** Provide:
  - **Arabic Word:** Original Arabic term.
  - **Transliteration:** Latin-script representation.
  - **Meanings:** English definitions.
  - **Frequency:** Number of occurrences in the Quran.
  - **Grammatical Info:** Part-of-speech tags, root, and morphological analysis.

### User Interface (UI)

- **Puzzle Grid:** Displays user guesses with feedback.
- **Input Method:** Supports English text input.
- **Detail Modal/Screen:** Shows detailed word information upon correct guess.
- **Settings:** Options to toggle transliteration, adjust language preferences, and customize feedback.

## Firestore Database Structure

The Firestore database will store game data and user progress efficiently. Below is the proposed structure:

### Collections & Documents

#### `words`

Stores the Quranic words used in the game.

```json
{
  "id": "word_id",
  "english_translation": "patience",
  "arabic_word": "الصبر",
  "transliteration": "As-Sabr",
  "meanings": ["patience", "endurance"],
  "occurrences": [
    { "surah": 2, "ayah": 153, "context": "Indeed, Allah is with the patient." },
    { "surah": 3, "ayah": 200, "context": "Be patient, persevere, and fear Allah." }
  ],
  "frequency": 20,
  "part_of_speech": "noun",
  "morphological_info": "root: ص ب ر"
}
```

#### `users`

Stores user progress and preferences.

```json
{
  "id": "user_id",
  "username": "zameel",
  "email": "user@example.com",
  "streak": 5,
  "last_played": "2025-02-08",
  "guessed_words": ["patience", "faith", "mercy"]
}
```

#### `game_sessions`

Stores user game sessions and performance.

```json
{
  "user_id": "user_id",
  "date": "2025-02-08",
  "word": "patience",
  "attempts": 4,
  "success": true
}
```

## Architecture

### Frontend

- **Platform:** Mobile (iOS/Android/Web) using React Native with Expo.
- **Key Components:**
  - **Puzzle Grid Component:** Displays guesses and feedback.
  - **Input Component:** Handles English text input.
  - **Introductory Modal Component:** Displays game instructions on first launch.
  - **Word Detail Component:** Shows detailed word information.
  - **Settings/Preferences:** Allows user customization.

### Backend

- **Database:** Firebase Firestore to store word data and user progress.
- **Security Rules:** Implement Firestore security rules to protect data and manage access.

## Development Workflow

- **Version Control:** Use Git for source code management.
- **Testing:** Implement unit and integration tests for both frontend and backend components.
- **CI/CD:** Set up continuous integration and deployment pipelines.

## Future Enhancements

- **Leaderboards:** Track and display user performance.
- **Learning Mode:** Offer additional resources like flashcards or quizzes.
- **Multi-Language Support:** Expand to include more translations or languages.
- **User Accounts:** Allow users to save progress and customize their experience.

## Tools & Libraries

- **Frontend:** React Native with Expo.
- **Backend:** Firebase Firestore.
- **Testing:** Jest for JavaScript.
- **Deployment:** Expo for app distribution.

## Conclusion

This document outlines the foundational aspects of the Versile App, detailing its objectives, features, architecture, and development considerations. It serves as a guide for the initial development phase and future iterations.
