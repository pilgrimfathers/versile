import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  saveGameState, 
  saveUserPreference, 
  createOrUpdateGuestData,
  saveGameSession,
  STORAGE_KEYS
} from './firestore';
import { GameState } from '../types';

/**
 * Migrates user data from AsyncStorage to Firestore
 * This should be called once when the app is updated to use Firestore
 */
export const migrateToFirestore = async (userId: string, isGuest: boolean): Promise<void> => {
  try {
    console.log('Starting migration from AsyncStorage to Firestore...');
    
    // Migrate theme preference
    const theme = await AsyncStorage.getItem('quranic_wordle_theme');
    if (theme) {
      await saveUserPreference(userId, STORAGE_KEYS.THEME, theme, isGuest);
      console.log('Migrated theme preference');
    }
    
    // Migrate intro shown status
    const introShown = await AsyncStorage.getItem('intro_shown');
    if (introShown) {
      await saveUserPreference(userId, STORAGE_KEYS.INTRO_SHOWN, introShown, isGuest);
      console.log('Migrated intro shown status');
    }
    
    // Migrate last played date
    const lastPlayedDate = await AsyncStorage.getItem('last_played_date');
    if (lastPlayedDate) {
      await saveUserPreference(userId, STORAGE_KEYS.LAST_PLAYED_DATE, lastPlayedDate, isGuest);
      console.log('Migrated last played date');
    }
    
    // Migrate game state
    const gameStateStr = await AsyncStorage.getItem('game_state');
    if (gameStateStr) {
      const gameState = JSON.parse(gameStateStr) as GameState;
      await saveGameState(userId, gameState, isGuest);
      console.log('Migrated game state');
    }
    
    // Migrate guest progress if applicable
    if (isGuest) {
      const guestId = await AsyncStorage.getItem('guest_id');
      if (guestId) {
        const guestProgress = await AsyncStorage.getItem(`progress_${guestId}`);
        if (guestProgress) {
          const progress = JSON.parse(guestProgress);
          await createOrUpdateGuestData(userId, progress);
          console.log('Migrated guest progress');
        }
        
        // Migrate guest sessions
        const allKeys = await AsyncStorage.getAllKeys();
        const sessionKeys = allKeys.filter(key => key.startsWith(`session_${guestId}`));
        
        for (const sessionKey of sessionKeys) {
          const sessionStr = await AsyncStorage.getItem(sessionKey);
          if (sessionStr) {
            const sessionData = JSON.parse(sessionStr);
            await saveGameSession(userId, {
              user_id: userId,
              date: sessionData.date,
              word: sessionData.word,
              attempts: sessionData.attempts,
              success: sessionData.success
            }, true);
          }
        }
        console.log('Migrated guest sessions');
      }
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};

/**
 * Cleans up AsyncStorage after successful migration
 * This should be called after confirming the migration was successful
 */
export const cleanupAsyncStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    console.log('AsyncStorage cleanup completed');
  } catch (error) {
    console.error('Error during AsyncStorage cleanup:', error);
  }
}; 