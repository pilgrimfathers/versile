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

// Sample 5-letter Quranic words data
const sampleWords = [
  {
    id: 'mercy',
    index: 0,
    english_translation: 'mercy',
    arabic_word: 'رحمة',
    transliteration: 'Rahma',
    meanings: ['mercy', 'grace', 'compassion', 'kindness'],
    occurrences: [
      {
        surah: 2,
        ayah: 157,
        context: 'Those are the ones upon whom are blessings from their Lord and mercy. And it is those who are [rightly] guided.'
      },
      {
        surah: 7,
        ayah: 156,
        context: 'My mercy encompasses all things.'
      }
    ],
    frequency: 79,
    part_of_speech: 'noun',
    morphological_info: 'root: ر ح م',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'peace',
    index: 1,
    english_translation: 'peace',
    arabic_word: 'سلام',
    transliteration: 'Salam',
    meanings: ['peace', 'security', 'safety', 'wellbeing'],
    occurrences: [
      {
        surah: 6,
        ayah: 54,
        context: 'Peace be upon you. Your Lord has decreed upon Himself mercy.'
      },
      {
        surah: 19,
        ayah: 47,
        context: 'Peace be upon you. I will ask forgiveness for you from my Lord.'
      }
    ],
    frequency: 42,
    part_of_speech: 'noun',
    morphological_info: 'root: س ل م',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'light',
    index: 2,
    english_translation: 'light',
    arabic_word: 'نور',
    transliteration: 'Noor',
    meanings: ['light', 'illumination', 'guidance', 'clarity'],
    occurrences: [
      {
        surah: 24,
        ayah: 35,
        context: 'Allah is the Light of the heavens and the earth.'
      },
      {
        surah: 5,
        ayah: 15,
        context: 'There has come to you from Allah a light and a clear Book.'
      }
    ],
    frequency: 43,
    part_of_speech: 'noun',
    morphological_info: 'root: ن و ر',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'truth',
    index: 3,
    english_translation: 'truth',
    arabic_word: 'حق',
    transliteration: 'Haqq',
    meanings: ['truth', 'reality', 'right', 'justice'],
    occurrences: [
      {
        surah: 2,
        ayah: 147,
        context: 'The truth is from your Lord, so never be among the doubters.'
      },
      {
        surah: 10,
        ayah: 32,
        context: 'For that is Allah, your Lord, the Truth.'
      }
    ],
    frequency: 287,
    part_of_speech: 'noun',
    morphological_info: 'root: ح ق ق',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'faith',
    index: 4,
    english_translation: 'faith',
    arabic_word: 'إيمان',
    transliteration: 'Iman',
    meanings: ['faith', 'belief', 'trust', 'conviction'],
    occurrences: [
      {
        surah: 3,
        ayah: 193,
        context: 'Our Lord, indeed we have heard a caller calling to faith.'
      },
      {
        surah: 49,
        ayah: 7,
        context: 'But Allah has endeared to you the faith and has made it pleasing in your hearts.'
      }
    ],
    frequency: 45,
    part_of_speech: 'noun',
    morphological_info: 'root: ء م ن',
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