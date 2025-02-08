require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc } = require('firebase/firestore');

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample Quranic words data
const sampleWords = [
  {
    id: 'sabr',
    english_translation: 'patience',
    arabic_word: 'الصبر',
    transliteration: 'As-Sabr',
    meanings: ['patience', 'perseverance', 'endurance'],
    occurrences: [
      {
        surah: 2,
        ayah: 153,
        context: 'O you who believe, seek help through patience and prayer. Indeed, Allah is with the patient.'
      },
      {
        surah: 3,
        ayah: 200,
        context: 'O you who believe, persevere and endure and remain stationed and fear Allah that you may be successful.'
      }
    ],
    frequency: 103,
    part_of_speech: 'noun',
    morphological_info: 'root: ص ب ر',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'taqwa',
    english_translation: 'piety',
    arabic_word: 'التقوى',
    transliteration: 'At-Taqwa',
    meanings: ['piety', 'God-consciousness', 'righteousness'],
    occurrences: [
      {
        surah: 2,
        ayah: 197,
        context: 'And take provisions, but indeed, the best provision is fear of Allah.'
      },
      {
        surah: 49,
        ayah: 13,
        context: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.'
      }
    ],
    frequency: 258,
    part_of_speech: 'noun',
    morphological_info: 'root: و ق ي',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function initializeFirestore() {
  try {
    console.log('Starting Firestore initialization...');
    
    // Add each word to Firestore using setDoc with explicit document IDs
    for (const word of sampleWords) {
      const wordId = word.id;
      const wordRef = doc(db, 'words', wordId);
      
      // Remove the id field before saving as it's already used as the document ID
      const { id, ...wordData } = word;
      
      await setDoc(wordRef, wordData);
      console.log(`Added word: ${word.english_translation} with ID: ${wordId}`);
    }
    
    console.log('Successfully initialized Firestore with sample data');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore(); 