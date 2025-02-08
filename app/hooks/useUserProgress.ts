import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, GameSession } from '../types';

export default function useUserProgress() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initializeUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    const newUser: User = {
      id: userId,
      username: `player_${userId.slice(0, 5)}`,
      email: '',
      streak: 0,
      last_played: '',
      guessed_words: []
    };

    await setDoc(userRef, newUser);
    return newUser;
  };

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      // Get stored user ID
      const userId = await AsyncStorage.getItem('user_id');
      
      if (!userId) {
        // Create new user ID if not exists
        const newUserId = `user_${Date.now()}`;
        await AsyncStorage.setItem('user_id', newUserId);
        const newUser = await initializeUser(newUserId);
        setUser(newUser);
        return;
      }

      // Fetch user data from Firestore
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() } as User);
      } else {
        const newUser = await initializeUser(userId);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgress = async (wordId: string, attempts: number, success: boolean) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
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
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  useEffect(() => {
    loadUserProgress();
  }, []);

  return {
    user,
    loading,
    updateUserProgress,
    loadUserProgress
  };
} 