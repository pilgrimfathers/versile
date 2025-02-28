import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, GameSession } from '../types';
import { useAuth } from '../context/AuthContext';

export default function useUserProgress() {
  const [loading, setLoading] = useState(true);
  const { user, isGuest } = useAuth();
  
  const initializeGuestUser = async () => {
    try {
      // Get stored guest ID
      let guestId = await AsyncStorage.getItem('guest_id');
      
      if (!guestId) {
        // Create new guest ID if not exists
        guestId = `guest_${Date.now()}`;
        await AsyncStorage.setItem('guest_id', guestId);
      }
      
      return guestId;
    } catch (error) {
      console.error('Error initializing guest user:', error);
      return `guest_${Date.now()}`;
    }
  };

  const updateUserProgress = async (wordId: string, attempts: number, success: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (user) {
        // Authenticated user - save progress to Firestore
        const userRef = doc(db, 'users', user.id);
        
        // Create game session
        const sessionRef = doc(db, 'game_sessions', `${user.id}_${today}`);
        const sessionData: GameSession = {
          user_id: user.id,
          date: today,
          word: wordId,
          attempts,
          success
        };
        await setDoc(sessionRef, sessionData);

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

        await updateDoc(userRef, updates);
      } else if (isGuest) {
        // Guest user - save progress to AsyncStorage
        const guestId = await initializeGuestUser();
        
        // Save game session locally
        const sessionKey = `session_${guestId}_${today}`;
        const sessionData = {
          date: today,
          word: wordId,
          attempts,
          success
        };
        await AsyncStorage.setItem(sessionKey, JSON.stringify(sessionData));
        
        // Update guest progress
        let guestProgress = await AsyncStorage.getItem(`progress_${guestId}`);
        let progress = guestProgress ? JSON.parse(guestProgress) : {
          last_played: '',
          streak: 0,
          guessed_words: []
        };
        
        progress.last_played = today;
        
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
        
        await AsyncStorage.setItem(`progress_${guestId}`, JSON.stringify(progress));
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