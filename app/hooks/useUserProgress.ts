import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, GameSession } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  createOrUpdateGuestData, 
  saveGameSession, 
  updateUserData 
} from '../utils/firestore';

export default function useUserProgress() {
  const [loading, setLoading] = useState(true);
  const { user, isGuest } = useAuth();
  
  const initializeGuestUser = async () => {
    try {
      // Get stored guest ID from auth context
      // The guest ID is now managed by the auth context
      if (isGuest) {
        return user?.id || '';
      }
      return '';
    } catch (error) {
      console.error('Error initializing guest user:', error);
      return '';
    }
  };

  const updateUserProgress = async (wordId: string, attempts: number, success: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (user && !isGuest) {
        // Authenticated user - save progress to Firestore
        
        // Create game session
        const sessionData: GameSession = {
          user_id: user.id,
          date: today,
          word: wordId,
          attempts,
          success
        };
        await saveGameSession(user.id, sessionData, false);

        // Update user progress
        const updates: Partial<User> = {
          last_played: today
        };

        if (success) {
          updates.guessed_words = [...user.guessed_words, wordId];
          
          // Update streak
          if (user.last_played) {
            const lastPlayed = new Date(user.last_played);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastPlayed.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
              updates.streak = user.streak + 1;
            } else {
              updates.streak = 1;
            }
          } else {
            updates.streak = 1;
          }
        } else {
          updates.streak = 0;
        }

        await updateUserData(user.id, updates);
      } else if (isGuest && user) {
        // Guest user - save progress to Firestore's guests collection
        const guestId = user.id;
        
        // Save game session
        const sessionData: GameSession = {
          user_id: guestId,
          date: today,
          word: wordId,
          attempts,
          success
        };
        await saveGameSession(guestId, sessionData, true);
        
        // Get current guest progress
        const guestRef = doc(db, 'guests', guestId);
        const guestDoc = await getDoc(guestRef);
        
        let progress = {
          last_played: today,
          streak: 0,
          guessed_words: [] as string[]
        };
        
        if (guestDoc.exists()) {
          const guestData = guestDoc.data();
          progress = {
            last_played: today,
            streak: guestData.streak || 0,
            guessed_words: guestData.guessed_words || []
          };
        }
        
        if (success) {
          progress.guessed_words = [...progress.guessed_words, wordId];
          
          // Update streak
          if (progress.last_played) {
            const lastPlayed = new Date(progress.last_played);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastPlayed.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
              progress.streak = progress.streak + 1;
            } else {
              progress.streak = 1;
            }
          } else {
            progress.streak = 1;
          }
        } else {
          progress.streak = 0;
        }
        
        await createOrUpdateGuestData(guestId, progress);
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  return {
    user,
    loading,
    updateUserProgress,
    isGuest
  };
} 