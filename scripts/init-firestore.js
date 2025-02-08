require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc, Timestamp } = require('firebase/firestore');

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample 5-letter Quranic words data
const sampleWords = [
  {
    "id": "mercy",
    "index": 0,
    "english_translation": "mercy",
    "arabic_word": "رحمة",
    "transliteration": "Rahma",
    "meanings": ["mercy", "grace", "compassion", "kindness"],
    "occurrences": [
      { "surah": 2, "ayah": 157, "context": "Those are the ones upon whom are blessings from their Lord and mercy." },
      { "surah": 7, "ayah": 156, "context": "My mercy encompasses all things." }
    ],
    "frequency": 79,
    "part_of_speech": "noun",
    "morphological_info": "root: ر ح م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "peace",
    "index": 1,
    "english_translation": "peace",
    "arabic_word": "سلام",
    "transliteration": "Salam",
    "meanings": ["peace", "security", "safety", "wellbeing"],
    "occurrences": [
      { "surah": 6, "ayah": 54, "context": "Peace be upon you; a reminder of divine protection." },
      { "surah": 19, "ayah": 47, "context": "A greeting of peace and calm from the Lord." }
    ],
    "frequency": 42,
    "part_of_speech": "noun",
    "morphological_info": "root: س ل م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "light",
    "index": 2,
    "english_translation": "light",
    "arabic_word": "نور",
    "transliteration": "Noor",
    "meanings": ["light", "illumination", "guidance", "clarity"],
    "occurrences": [
      { "surah": 24, "ayah": 35, "context": "Allah is the Light of the heavens and the earth." },
      { "surah": 5, "ayah": 15, "context": "A light that guides the believers in darkness." }
    ],
    "frequency": 43,
    "part_of_speech": "noun",
    "morphological_info": "root: ن و ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "truth",
    "index": 3,
    "english_translation": "truth",
    "arabic_word": "حق",
    "transliteration": "Haqq",
    "meanings": ["truth", "reality", "justice", "correctness"],
    "occurrences": [
      { "surah": 2, "ayah": 147, "context": "The truth is from your Lord, a beacon for the faithful." },
      { "surah": 10, "ayah": 32, "context": "A declaration of truth that sustains the believers." }
    ],
    "frequency": 287,
    "part_of_speech": "noun",
    "morphological_info": "root: ح ق ق",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "faith",
    "index": 4,
    "english_translation": "faith",
    "arabic_word": "إيمان",
    "transliteration": "Iman",
    "meanings": ["faith", "belief", "trust", "conviction"],
    "occurrences": [
      { "surah": 3, "ayah": 193, "context": "A call to faith that uplifts the soul." },
      { "surah": 49, "ayah": 7, "context": "Faith made pleasing in the hearts of the believers." }
    ],
    "frequency": 45,
    "part_of_speech": "noun",
    "morphological_info": "root: ء م ن",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "grace",
    "index": 5,
    "english_translation": "grace",
    "arabic_word": "نعمة",
    "transliteration": "Ni'mah",
    "meanings": ["grace", "favor", "blessing", "bounty"],
    "occurrences": [
      { "surah": 7, "ayah": 96, "context": "A manifestation of divine grace upon the believers." },
      { "surah": 11, "ayah": 48, "context": "Grace bestowed as a sign of mercy and favor." }
    ],
    "frequency": 60,
    "part_of_speech": "noun",
    "morphological_info": "root: ن ع م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "power",
    "index": 6,
    "english_translation": "power",
    "arabic_word": "قدرة",
    "transliteration": "Qudrah",
    "meanings": ["power", "ability", "capability", "might"],
    "occurrences": [
      { "surah": 46, "ayah": 33, "context": "A testament to the power of the Almighty." },
      { "surah": 2, "ayah": 20, "context": "Power that supports the universe and its order." }
    ],
    "frequency": 55,
    "part_of_speech": "noun",
    "morphological_info": "root: ق د ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "heart",
    "index": 7,
    "english_translation": "heart",
    "arabic_word": "قلب",
    "transliteration": "Qalb",
    "meanings": ["heart", "core", "soul", "center"],
    "occurrences": [
      { "surah": 22, "ayah": 46, "context": "A symbol of perception and inner guidance." },
      { "surah": 16, "ayah": 90, "context": "The heart is a vessel for sincere belief." }
    ],
    "frequency": 50,
    "part_of_speech": "noun",
    "morphological_info": "root: ق ل ب",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "trust",
    "index": 8,
    "english_translation": "trust",
    "arabic_word": "ثقة",
    "transliteration": "Thiqah",
    "meanings": ["trust", "confidence", "reliance", "assurance"],
    "occurrences": [
      { "surah": 3, "ayah": 159, "context": "A call to trust in the guidance of the Lord." },
      { "surah": 65, "ayah": 3, "context": "Trust established through faith and submission." }
    ],
    "frequency": 48,
    "part_of_speech": "noun",
    "morphological_info": "root: ث ق ة",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "angel",
    "index": 9,
    "english_translation": "angel",
    "arabic_word": "ملاك",
    "transliteration": "Malak",
    "meanings": ["angel", "messenger", "spirit", "divine servant"],
    "occurrences": [
      { "surah": 35, "ayah": 1, "context": "Angels serve as messengers of divine decree." },
      { "surah": 27, "ayah": 24, "context": "An angelic presence guiding the believers." }
    ],
    "frequency": 65,
    "part_of_speech": "noun",
    "morphological_info": "root: م ل ك",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "salah",
    "index": 10,
    "english_translation": "prayer",
    "arabic_word": "صلاة",
    "transliteration": "Salah",
    "meanings": ["prayer", "worship", "supplication", "devotion"],
    "occurrences": [
      { "surah": 2, "ayah": 3, "context": "The establishment of salah as a pillar of faith." },
      { "surah": 29, "ayah": 45, "context": "Salah, the daily communion with the Divine." }
    ],
    "frequency": 100,
    "part_of_speech": "noun",
    "morphological_info": "root: ص ل و",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "jihad",
    "index": 11,
    "english_translation": "struggle",
    "arabic_word": "جهاد",
    "transliteration": "Jihad",
    "meanings": ["struggle", "effort", "exertion", "striving"],
    "occurrences": [
      { "surah": 22, "ayah": 78, "context": "Jihad signifies the struggle for righteousness." },
      { "surah": 2, "ayah": 190, "context": "Engage in jihad, the noble struggle against injustice." }
    ],
    "frequency": 30,
    "part_of_speech": "noun",
    "morphological_info": "root: ج ه د",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "falah",
    "index": 12,
    "english_translation": "success",
    "arabic_word": "فلاح",
    "transliteration": "Falah",
    "meanings": ["success", "prosperity", "salvation", "achievement"],
    "occurrences": [
      { "surah": 37, "ayah": 24, "context": "Falah awaits those who follow the divine path." },
      { "surah": 25, "ayah": 15, "context": "The promise of falah is a sign of divine favor." }
    ],
    "frequency": 35,
    "part_of_speech": "noun",
    "morphological_info": "root: ف ل ح",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "zakat",
    "index": 13,
    "english_translation": "alms",
    "arabic_word": "زكاة",
    "transliteration": "Zakat",
    "meanings": ["charity", "almsgiving", "purification", "growth"],
    "occurrences": [
      { "surah": 2, "ayah": 177, "context": "Zakat is prescribed for the purification of wealth." },
      { "surah": 9, "ayah": 60, "context": "The giving of zakat is a duty for every believer." }
    ],
    "frequency": 40,
    "part_of_speech": "noun",
    "morphological_info": "root: ز ك و",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "quran",
    "index": 14,
    "english_translation": "Quran",
    "arabic_word": "قرآن",
    "transliteration": "Quran",
    "meanings": ["recitation", "divine book", "guidance", "scripture"],
    "occurrences": [
      { "surah": 1, "ayah": 1, "context": "The Quran, a timeless source of guidance." },
      { "surah": 2, "ayah": 2, "context": "Revelation of the Quran for the people of guidance." }
    ],
    "frequency": 200,
    "part_of_speech": "noun",
    "morphological_info": "root: ق ر أ ن",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "piety",
    "index": 15,
    "english_translation": "piety",
    "arabic_word": "تقوى",
    "transliteration": "Taqwa",
    "meanings": ["piety", "righteousness", "devoutness", "fear of God"],
    "occurrences": [
      { "surah": 2, "ayah": 197, "context": "Piety guides the believer in all matters." },
      { "surah": 3, "ayah": 102, "context": "A call to piety and mindful living." }
    ],
    "frequency": 55,
    "part_of_speech": "noun",
    "morphological_info": "root: ت ق و",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "bliss",
    "index": 16,
    "english_translation": "bliss",
    "arabic_word": "نعيم",
    "transliteration": "Na'im",
    "meanings": ["bliss", "delight", "happiness", "paradise"],
    "occurrences": [
      { "surah": 56, "ayah": 10, "context": "The bliss of Paradise promised to the faithful." },
      { "surah": 2, "ayah": 25, "context": "A taste of eternal bliss awaits the righteous." }
    ],
    "frequency": 50,
    "part_of_speech": "noun",
    "morphological_info": "root: ن ع م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "noble",
    "index": 17,
    "english_translation": "noble",
    "arabic_word": "شريف",
    "transliteration": "Shareef",
    "meanings": ["noble", "honorable", "exalted", "dignified"],
    "occurrences": [
      { "surah": 17, "ayah": 70, "context": "The noble character encouraged among the believers." },
      { "surah": 16, "ayah": 90, "context": "A call to be noble in thought and action." }
    ],
    "frequency": 45,
    "part_of_speech": "adjective",
    "morphological_info": "root: ش ر ف",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "qibla",
    "index": 18,
    "english_translation": "qibla",
    "arabic_word": "قبلة",
    "transliteration": "Qiblah",
    "meanings": ["direction", "orientation", "focus", "aim"],
    "occurrences": [
      { "surah": 2, "ayah": 144, "context": "The qibla reorients the hearts of the believers." },
      { "surah": 3, "ayah": 96, "context": "A sign of unity as all face the qibla." }
    ],
    "frequency": 70,
    "part_of_speech": "noun",
    "morphological_info": "root: ق ب ل",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "hiday",
    "index": 19,
    "english_translation": "guide",
    "arabic_word": "هداية",
    "transliteration": "Hidaya",
    "meanings": ["guidance", "direction", "instruction", "enlightenment"],
    "occurrences": [
      { "surah": 2, "ayah": 2, "context": "Hidaya is granted to those who seek the truth." },
      { "surah": 17, "ayah": 9, "context": "A clear hiday for the righteous path." }
    ],
    "frequency": 60,
    "part_of_speech": "noun",
    "morphological_info": "root: ه د ي",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "azhar",
    "index": 20,
    "english_translation": "bright",
    "arabic_word": "أزهر",
    "transliteration": "Azhar",
    "meanings": ["radiant", "luminous", "flourishing", "vibrant"],
    "occurrences": [
      { "surah": 35, "ayah": 37, "context": "Azhar signifies blooming brilliance in creation." },
      { "surah": 16, "ayah": 5, "context": "A metaphor for the azhar of divine wisdom." }
    ],
    "frequency": 38,
    "part_of_speech": "adjective",
    "morphological_info": "root: أ ز ه ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "dhikr",
    "index": 21,
    "english_translation": "remind",
    "arabic_word": "ذكر",
    "transliteration": "Dhikr",
    "meanings": ["remembrance", "mention", "recital", "invocation"],
    "occurrences": [
      { "surah": 33, "ayah": 41, "context": "Dhikr is a means to keep the heart connected to the Divine." },
      { "surah": 13, "ayah": 28, "context": "Frequent dhikr brings tranquility to the soul." }
    ],
    "frequency": 80,
    "part_of_speech": "noun",
    "morphological_info": "root: ذ ك ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "sawab",
    "index": 22,
    "english_translation": "reward",
    "arabic_word": "ثواب",
    "transliteration": "Sawab",
    "meanings": ["reward", "merit", "benefit", "grace"],
    "occurrences": [
      { "surah": 16, "ayah": 97, "context": "Good deeds are met with sawab in the hereafter." },
      { "surah": 2, "ayah": 277, "context": "Sawab is reserved for those who strive in the path of righteousness." }
    ],
    "frequency": 47,
    "part_of_speech": "noun",
    "morphological_info": "root: ث و ب",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "sakin",
    "index": 23,
    "english_translation": "calm",
    "arabic_word": "ساكن",
    "transliteration": "Sakin",
    "meanings": ["calm", "tranquil", "quiet", "serene"],
    "occurrences": [
      { "surah": 48, "ayah": 4, "context": "The heart finds rest in a sakin spirit." },
      { "surah": 33, "ayah": 35, "context": "A sakin nature is a blessing for the faithful." }
    ],
    "frequency": 33,
    "part_of_speech": "adjective",
    "morphological_info": "root: س ك ن",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "hifdh",
    "index": 24,
    "english_translation": "preserve",
    "arabic_word": "حفظ",
    "transliteration": "Hifdh",
    "meanings": ["preservation", "memorization", "conservation", "protection"],
    "occurrences": [
      { "surah": 96, "ayah": 1, "context": "The art of hifdh is treasured by generations." },
      { "surah": 73, "ayah": 8, "context": "Hifdh ensures the divine message is passed down." }
    ],
    "frequency": 29,
    "part_of_speech": "noun",
    "morphological_info": "root: ح ف ظ",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "shifa",
    "index": 25,
    "english_translation": "healing",
    "arabic_word": "شفاء",
    "transliteration": "Shifa",
    "meanings": ["healing", "cure", "remedy", "restoration"],
    "occurrences": [
      { "surah": 26, "ayah": 80, "context": "Shifa is granted to those who call upon the Divine." },
      { "surah": 17, "ayah": 82, "context": "The Quran is a source of shifa for every soul." }
    ],
    "frequency": 52,
    "part_of_speech": "noun",
    "morphological_info": "root: ش ف ا",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "rizqi",
    "index": 26,
    "english_translation": "sustenance",
    "arabic_word": "رزق",
    "transliteration": "Rizqi",
    "meanings": ["sustenance", "provision", "livelihood", "blessing"],
    "occurrences": [
      { "surah": 51, "ayah": 58, "context": "Rizqi flows abundantly for those who trust in the Lord." },
      { "surah": 14, "ayah": 31, "context": "Every creature receives its rizqi by divine decree." }
    ],
    "frequency": 60,
    "part_of_speech": "noun",
    "morphological_info": "root: ر ز ق",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "zuhud",
    "index": 27,
    "english_translation": "ascetic",
    "arabic_word": "زهد",
    "transliteration": "Zuhud",
    "meanings": ["asceticism", "detachment", "renunciation", "simplicity"],
    "occurrences": [
      { "surah": 31, "ayah": 18, "context": "Zuhud is admired as a path to spiritual purity." },
      { "surah": 57, "ayah": 20, "context": "The practice of zuhud nurtures inner peace." }
    ],
    "frequency": 34,
    "part_of_speech": "noun",
    "morphological_info": "root: ز ه د",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "janna",
    "index": 28,
    "english_translation": "paradise",
    "arabic_word": "جنة",
    "transliteration": "Janna",
    "meanings": ["paradise", "garden", "heaven", "eternity"],
    "occurrences": [
      { "surah": 2, "ayah": 25, "context": "Janna is the eternal abode for the righteous." },
      { "surah": 56, "ayah": 10, "context": "The promise of janna comforts the faithful." }
    ],
    "frequency": 90,
    "part_of_speech": "noun",
    "morphological_info": "root: ج ن ن",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "qadar",
    "index": 29,
    "english_translation": "fate",
    "arabic_word": "قدر",
    "transliteration": "Qadar",
    "meanings": ["fate", "decree", "destiny", "predestination"],
    "occurrences": [
      { "surah": 54, "ayah": 49, "context": "Qadar encompasses the destiny of all creation." },
      { "surah": 32, "ayah": 8, "context": "The decree of qadar is beyond human control." }
    ],
    "frequency": 85,
    "part_of_speech": "noun",
    "morphological_info": "root: ق د ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "sujud",
    "index": 30,
    "english_translation": "prostration",
    "arabic_word": "سجود",
    "transliteration": "Sujud",
    "meanings": ["prostration", "bowing", "submission", "worship"],
    "occurrences": [
      { "surah": 7, "ayah": 206, "context": "Sujud is the physical act of devotion." },
      { "surah": 38, "ayah": 24, "context": "The believers engage in sujud during prayer." }
    ],
    "frequency": 50,
    "part_of_speech": "noun",
    "morphological_info": "root: س ج د",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "akhir",
    "index": 31,
    "english_translation": "last",
    "arabic_word": "آخر",
    "transliteration": "Akhir",
    "meanings": ["last", "final", "end", "ultimate"],
    "occurrences": [
      { "surah": 75, "ayah": 36, "context": "Akhir denotes the finality in divine decree." },
      { "surah": 18, "ayah": 102, "context": "Contemplation of akhir inspires humility." }
    ],
    "frequency": 65,
    "part_of_speech": "adjective",
    "morphological_info": "root: آ خ ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "hijab",
    "index": 32,
    "english_translation": "veil",
    "arabic_word": "حجاب",
    "transliteration": "Hijab",
    "meanings": ["veil", "covering", "modesty", "privacy"],
    "occurrences": [
      { "surah": 33, "ayah": 59, "context": "Hijab is prescribed as a sign of modesty." },
      { "surah": 24, "ayah": 31, "context": "The concept of hijab extends to both physical and moral boundaries." }
    ],
    "frequency": 40,
    "part_of_speech": "noun",
    "morphological_info": "root: ح ج ب",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "awrah",
    "index": 33,
    "english_translation": "cover",
    "arabic_word": "عورة",
    "transliteration": "Awrah",
    "meanings": ["covering", "modesty", "intimacy", "privacy"],
    "occurrences": [
      { "surah": 33, "ayah": 53, "context": "Awrah refers to parts of the body to be guarded." },
      { "surah": 24, "ayah": 30, "context": "The concept of awrah emphasizes dignity and modesty." }
    ],
    "frequency": 30,
    "part_of_speech": "noun",
    "morphological_info": "root: ع و ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "mizan",
    "index": 34,
    "english_translation": "balance",
    "arabic_word": "ميزان",
    "transliteration": "Mizan",
    "meanings": ["balance", "scale", "justice", "equilibrium"],
    "occurrences": [
      { "surah": 55, "ayah": 7, "context": "Mizan symbolizes divine justice and balance." },
      { "surah": 21, "ayah": 47, "context": "Every deed is weighed on the mizan of truth." }
    ],
    "frequency": 55,
    "part_of_speech": "noun",
    "morphological_info": "root: م ي ز ن",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "sirat",
    "index": 35,
    "english_translation": "path",
    "arabic_word": "صراط",
    "transliteration": "Sirat",
    "meanings": ["path", "way", "route", "course"],
    "occurrences": [
      { "surah": 1, "ayah": 6, "context": "The sirat al-mustaqim guides believers to righteousness." },
      { "surah": 17, "ayah": 29, "context": "Following the sirat ensures a life of virtue." }
    ],
    "frequency": 70,
    "part_of_speech": "noun",
    "morphological_info": "root: ص ر ط",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "dunya",
    "index": 36,
    "english_translation": "world",
    "arabic_word": "دنيا",
    "transliteration": "Dunya",
    "meanings": ["world", "life", "temporal", "earthly"],
    "occurrences": [
      { "surah": 57, "ayah": 20, "context": "Dunya is transient compared to the eternal hereafter." },
      { "surah": 18, "ayah": 45, "context": "The allure of dunya is both a test and a blessing." }
    ],
    "frequency": 95,
    "part_of_speech": "noun",
    "morphological_info": "root: د ن و",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "sabab",
    "index": 37,
    "english_translation": "cause",
    "arabic_word": "سبب",
    "transliteration": "Sabab",
    "meanings": ["cause", "reason", "motive", "origin"],
    "occurrences": [
      { "surah": 16, "ayah": 77, "context": "Sabab for creation is known only to the Divine." },
      { "surah": 2, "ayah": 286, "context": "Every event has its sabab in the cosmic order." }
    ],
    "frequency": 42,
    "part_of_speech": "noun",
    "morphological_info": "root: س ب ب",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "awwal",
    "index": 38,
    "english_translation": "first",
    "arabic_word": "أول",
    "transliteration": "Awwal",
    "meanings": ["first", "beginning", "primary", "initial"],
    "occurrences": [
      { "surah": 3, "ayah": 7, "context": "Awwal indicates the commencement of divine revelation." },
      { "surah": 20, "ayah": 114, "context": "The awwal in order is a reminder of new beginnings." }
    ],
    "frequency": 37,
    "part_of_speech": "adjective",
    "morphological_info": "root: أ و ل",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "majid",
    "index": 39,
    "english_translation": "glory",
    "arabic_word": "مجيد",
    "transliteration": "Majid",
    "meanings": ["glorious", "majestic", "exalted", "noble"],
    "occurrences": [
      { "surah": 35, "ayah": 28, "context": "Majid is used to describe the exalted nature of the Divine." },
      { "surah": 55, "ayah": 27, "context": "The majid qualities inspire awe among the faithful." }
    ],
    "frequency": 75,
    "part_of_speech": "adjective",
    "morphological_info": "root: م ج د",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "rabbi",
    "index": 40,
    "english_translation": "lord",
    "arabic_word": "ربي",
    "transliteration": "Rabbi",
    "meanings": ["lord", "master", "sustainer", "protector"],
    "occurrences": [
      { "surah": 23, "ayah": 114, "context": "Rabbi is a term of endearment and reverence for the Creator." },
      { "surah": 16, "ayah": 36, "context": "Acknowledging rabbi reflects deep devotion." }
    ],
    "frequency": 88,
    "part_of_speech": "noun",
    "morphological_info": "root: ر ب ب",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "khair",
    "index": 41,
    "english_translation": "good",
    "arabic_word": "خير",
    "transliteration": "Khair",
    "meanings": ["good", "benevolence", "benefit", "excellence"],
    "occurrences": [
      { "surah": 2, "ayah": 261, "context": "Khair is promised to those who give generously." },
      { "surah": 57, "ayah": 7, "context": "The khair of actions is recorded by the angels." }
    ],
    "frequency": 92,
    "part_of_speech": "noun",
    "morphological_info": "root: خ ي ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "halal",
    "index": 42,
    "english_translation": "lawful",
    "arabic_word": "حلال",
    "transliteration": "Halal",
    "meanings": ["lawful", "permissible", "authorized", "approved"],
    "occurrences": [
      { "surah": 5, "ayah": 101, "context": "Halal denotes what is permitted under divine law." },
      { "surah": 2, "ayah": 168, "context": "The believers are commanded to consume only halal." }
    ],
    "frequency": 65,
    "part_of_speech": "adjective",
    "morphological_info": "root: ح ل ل",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "haram",
    "index": 43,
    "english_translation": "forbid",
    "arabic_word": "حرام",
    "transliteration": "Haram",
    "meanings": ["forbidden", "prohibited", "unlawful", "taboo"],
    "occurrences": [
      { "surah": 2, "ayah": 173, "context": "Haram substances and actions are strictly avoided." },
      { "surah": 5, "ayah": 3, "context": "Haram defines what is impermissible in the faith." }
    ],
    "frequency": 60,
    "part_of_speech": "adjective",
    "morphological_info": "root: ح ر م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "nimah",
    "index": 44,
    "english_translation": "gift",
    "arabic_word": "نعمة",
    "transliteration": "Nimah",
    "meanings": ["gift", "blessing", "bounty", "favour"],
    "occurrences": [
      { "surah": 14, "ayah": 7, "context": "Every nimah is a sign of divine generosity." },
      { "surah": 16, "ayah": 18, "context": "The nimah of life sustains all creation." }
    ],
    "frequency": 48,
    "part_of_speech": "noun",
    "morphological_info": "root: ن ع م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "zafar",
    "index": 45,
    "english_translation": "victor",
    "arabic_word": "ظفر",
    "transliteration": "Zafar",
    "meanings": ["victory", "triumph", "success", "conquest"],
    "occurrences": [
      { "surah": 54, "ayah": 50, "context": "Zafar is a reward for steadfast perseverance." },
      { "surah": 28, "ayah": 79, "context": "The promise of zafar inspires the believers." }
    ],
    "frequency": 40,
    "part_of_speech": "noun",
    "morphological_info": "root: ظ ف ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "tabir",
    "index": 46,
    "english_translation": "interpret",
    "arabic_word": "تعبير",
    "transliteration": "Tabir",
    "meanings": ["interpretation", "explanation", "expression", "clarification"],
    "occurrences": [
      { "surah": 12, "ayah": 32, "context": "Tabir brings clarity to complex divine signs." },
      { "surah": 28, "ayah": 24, "context": "The art of tabir unveils hidden meanings." }
    ],
    "frequency": 35,
    "part_of_speech": "noun",
    "morphological_info": "root: ت ب ر",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "awwad",
    "index": 47,
    "english_translation": "forgiver",
    "arabic_word": "عوّاد",
    "transliteration": "Awwad",
    "meanings": ["most forgiving", "compassionate", "merciful", "lenient"],
    "occurrences": [
      { "surah": 39, "ayah": 53, "context": "Awwad reflects the endless mercy of the Divine." },
      { "surah": 2, "ayah": 286, "context": "The quality of being awwad inspires forgiveness among believers." }
    ],
    "frequency": 33,
    "part_of_speech": "adjective",
    "morphological_info": "root: ع و د",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "azmat",
    "index": 48,
    "english_translation": "majesty",
    "arabic_word": "عظمة",
    "transliteration": "Azmat",
    "meanings": ["majesty", "greatness", "glory", "grandeur"],
    "occurrences": [
      { "surah": 35, "ayah": 28, "context": "Azmat denotes the sublime grandeur of the Creator." },
      { "surah": 55, "ayah": 26, "context": "The azmat of all things reflects divine perfection." }
    ],
    "frequency": 47,
    "part_of_speech": "noun",
    "morphological_info": "root: ع ظ م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  },
  {
    "id": "hikam",
    "index": 49,
    "english_translation": "maxims",
    "arabic_word": "حِكَم",
    "transliteration": "Hikam",
    "meanings": ["maxims", "wise sayings", "adages", "principles"],
    "occurrences": [
      { "surah": 31, "ayah": 21, "context": "Hikam of the prophets guide the hearts of believers." },
      { "surah": 57, "ayah": 16, "context": "Reflecting on hikam nurtures wisdom and insight." }
    ],
    "frequency": 30,
    "part_of_speech": "noun",
    "morphological_info": "root: ح ك م",
    "created_at": Timestamp.now(),
    "updated_at": Timestamp.now()
  }
]


async function initializeFirestore() {
  try {
    console.log('Starting Firestore initialization...');
    
    // Add each word to Firestore using setDoc with explicit document IDs
    for (const word of sampleWords) {
      const wordId = word['id'];
      console.log('wordId', wordId);
      const wordRef = doc(db, 'words', wordId);
      console.log('wordRef', wordRef);
      
      try {
        const { id, ...wordData } = word;
        console.log('wordData', wordData);
        await setDoc(wordRef, wordData);
        console.log('wordData', wordData);
        console.log(`Added word: ${word.english_translation} with ID: ${wordId}`);
      } catch (error) {
        console.error('Error adding word:', error);
      }
    }
    
    console.log('Successfully initialized Firestore with sample data');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore(); 