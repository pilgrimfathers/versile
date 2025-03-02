import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { GameSession, LeaderboardEntry, User, WeeklyScore } from '../types';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';

// Constants for scoring
const BASE_SCORE = 100;
const MAX_ATTEMPTS = 6;
const ATTEMPT_BONUS = 20; // Points per unused attempt
const STREAK_BONUS_MULTIPLIER = 0.1; // 10% bonus per day in streak

/**
 * Calculate score for a game session
 * @param attempts Number of attempts used
 * @param success Whether the game was successful
 * @param currentStreak Current streak of the user
 * @returns Score for the game
 */
export function calculateGameScore(attempts: number, success: boolean, currentStreak: number): number {
  if (!success) return 0;
  
  // Base score for completing the challenge
  let score = BASE_SCORE;
  
  // Bonus for completing in fewer attempts
  const unusedAttempts = MAX_ATTEMPTS - attempts;
  score += unusedAttempts * ATTEMPT_BONUS;
  
  // Bonus for streak
  const streakBonus = Math.floor(score * (currentStreak * STREAK_BONUS_MULTIPLIER));
  score += streakBonus;
  
  console.log('Score calculation:', { 
    base: BASE_SCORE, 
    attemptBonus: unusedAttempts * ATTEMPT_BONUS, 
    streakBonus, 
    totalScore: score,
    attempts,
    unusedAttempts,
    currentStreak
  });
  
  return score;
}

/**
 * Get the current week's start and end dates
 * @returns Object with week_start and week_end as ISO date strings
 */
export function getCurrentWeekDates(): { week_start: string, week_end: string } {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  return {
    week_start: format(weekStart, 'yyyy-MM-dd'),
    week_end: format(weekEnd, 'yyyy-MM-dd')
  };
}

/**
 * Update a user's weekly score
 * @param userId User ID
 * @param score Score to add
 * @param gameWon Whether the game was won
 * @param currentStreak Current streak of the user
 * @param isGuest Whether the user is a guest
 */
export async function updateWeeklyScore(
  userId: string, 
  score: number, 
  gameWon: boolean, 
  currentStreak: number,
  isGuest: boolean = false
): Promise<void> {
  try {
    console.log('Updating weekly score:', { userId, score, gameWon, currentStreak, isGuest });
    
    const { week_start, week_end } = getCurrentWeekDates();
    console.log('Week dates:', { week_start, week_end });
    
    const collectionName = isGuest ? 'guest_weekly_scores' : 'weekly_scores';
    const weeklyScoreId = `${userId}_${week_start}`;
    const weeklyScoreRef = doc(db, collectionName, weeklyScoreId);
    const weeklyScoreDoc = await getDoc(weeklyScoreRef);
    
    if (weeklyScoreDoc.exists()) {
      // Update existing weekly score
      const existingData = weeklyScoreDoc.data() as WeeklyScore;
      console.log('Existing weekly score:', existingData);
      
      const updatedData: Partial<WeeklyScore> = {
        score: existingData.score + score,
        games_played: existingData.games_played + 1,
        games_won: existingData.games_won + (gameWon ? 1 : 0),
        best_streak: Math.max(existingData.best_streak, currentStreak)
      };
      
      console.log('Updating weekly score with:', updatedData);
      await updateDoc(weeklyScoreRef, updatedData);
      console.log('Weekly score updated successfully');
    } else {
      // Create new weekly score
      const newWeeklyScore: WeeklyScore = {
        user_id: userId,
        week_start,
        week_end,
        score,
        games_played: 1,
        games_won: gameWon ? 1 : 0,
        best_streak: currentStreak
      };
      
      console.log('Creating new weekly score:', newWeeklyScore);
      await setDoc(weeklyScoreRef, newWeeklyScore);
      console.log('New weekly score created successfully');
    }
    
    // Update user's total and weekly scores
    await updateUserScores(userId, score, currentStreak, isGuest);
  } catch (error) {
    console.error('Error updating weekly score:', error);
  }
}

/**
 * Update a user's score fields
 * @param userId User ID
 * @param scoreToAdd Score to add to the user's total and weekly scores
 * @param currentStreak Current streak of the user
 * @param isGuest Whether the user is a guest
 */
async function updateUserScores(
  userId: string, 
  scoreToAdd: number, 
  currentStreak: number,
  isGuest: boolean = false
): Promise<void> {
  try {
    console.log('Updating user scores:', { userId, scoreToAdd, currentStreak, isGuest });
    
    const collectionName = isGuest ? 'guests' : 'users';
    const userRef = doc(db, collectionName, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      console.log('Current user data:', { 
        total_score: userData.total_score, 
        current_week_score: userData.current_week_score,
        longest_streak: userData.longest_streak,
        last_week_start: userData.last_week_start
      });
      
      const updates: Partial<User> = {
        total_score: (userData.total_score || 0) + scoreToAdd,
        current_week_score: (userData.current_week_score || 0) + scoreToAdd,
        longest_streak: Math.max(userData.longest_streak || 0, currentStreak)
      };
      
      // If this is a new week, reset the weekly score
      const { week_start } = getCurrentWeekDates();
      const lastWeekStart = userData.last_week_start;
      
      if (lastWeekStart !== week_start) {
        updates.last_week_start = week_start;
        updates.best_week_score = Math.max(userData.best_week_score || 0, userData.current_week_score || 0);
        updates.current_week_score = scoreToAdd; // Reset to current score
      }
      
      console.log('Updating user with:', updates);
      await updateDoc(userRef, updates);
      console.log('User scores updated successfully');
    } else {
      console.log('User document does not exist');
    }
  } catch (error) {
    console.error('Error updating user scores:', error);
  }
}

/**
 * Get the current week's leaderboard
 * @param limit Maximum number of entries to return
 * @param includeGuests Whether to include guest users
 * @returns Array of leaderboard entries
 */
export async function getWeeklyLeaderboard(
  maxEntries: number = 10,
  includeGuests: boolean = false
): Promise<LeaderboardEntry[]> {
  try {
    const { week_start } = getCurrentWeekDates();
    const leaderboard: LeaderboardEntry[] = [];
    
    // Get regular users' scores
    const weeklyScoresRef = collection(db, 'weekly_scores');
    const weeklyScoresQuery = query(
      weeklyScoresRef,
      where('week_start', '==', week_start),
      orderBy('score', 'desc'),
      limit(maxEntries)
    );
    
    const weeklyScoresSnapshot = await getDocs(weeklyScoresQuery);
    
    // Process regular users
    for (const scoreDoc of weeklyScoresSnapshot.docs) {
      const weeklyScore = scoreDoc.data() as WeeklyScore;
      const userRef = doc(db, 'users', weeklyScore.user_id);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        
        leaderboard.push({
          user_id: weeklyScore.user_id,
          username: userData.username,
          score: weeklyScore.score,
          rank: 0, // Will be calculated later
          games_played: weeklyScore.games_played,
          games_won: weeklyScore.games_won,
          best_streak: weeklyScore.best_streak
        });
      }
    }
    
    // Include guest users if requested
    if (includeGuests) {
      const guestScoresRef = collection(db, 'guest_weekly_scores');
      const guestScoresQuery = query(
        guestScoresRef,
        where('week_start', '==', week_start),
        orderBy('score', 'desc'),
        limit(maxEntries)
      );
      
      const guestScoresSnapshot = await getDocs(guestScoresQuery);
      
      for (const scoreDoc of guestScoresSnapshot.docs) {
        const weeklyScore = scoreDoc.data() as WeeklyScore;
        const guestRef = doc(db, 'guests', weeklyScore.user_id);
        const guestDoc = await getDoc(guestRef);
        
        if (guestDoc.exists()) {
          leaderboard.push({
            user_id: weeklyScore.user_id,
            username: `Guest ${weeklyScore.user_id.substring(0, 4)}`,
            score: weeklyScore.score,
            rank: 0, // Will be calculated later
            games_played: weeklyScore.games_played,
            games_won: weeklyScore.games_won,
            best_streak: weeklyScore.best_streak
          });
        }
      }
    }
    
    // Sort by score and assign ranks
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    // Limit to requested number of entries
    return leaderboard.slice(0, maxEntries);
  } catch (error) {
    console.error('Error getting weekly leaderboard:', error);
    return [];
  }
}

/**
 * Get a user's position on the leaderboard
 * @param userId User ID
 * @param isGuest Whether the user is a guest
 * @returns User's leaderboard entry, or null if not found
 */
export async function getUserLeaderboardPosition(
  userId: string,
  isGuest: boolean = false
): Promise<LeaderboardEntry | null> {
  try {
    const { week_start } = getCurrentWeekDates();
    const collectionName = isGuest ? 'guest_weekly_scores' : 'weekly_scores';
    const weeklyScoreId = `${userId}_${week_start}`;
    const weeklyScoreRef = doc(db, collectionName, weeklyScoreId);
    const weeklyScoreDoc = await getDoc(weeklyScoreRef);
    
    if (!weeklyScoreDoc.exists()) {
      return null;
    }
    
    const weeklyScore = weeklyScoreDoc.data() as WeeklyScore;
    
    // Get all scores for the current week to determine rank
    const allScoresRef = collection(db, collectionName);
    const allScoresQuery = query(
      allScoresRef,
      where('week_start', '==', week_start),
      orderBy('score', 'desc')
    );
    
    const allScoresSnapshot = await getDocs(allScoresQuery);
    const allScores = allScoresSnapshot.docs.map(doc => doc.data() as WeeklyScore);
    
    // Find user's rank
    const rank = allScores.findIndex(score => score.user_id === userId) + 1;
    
    // Get user data
    const userCollectionName = isGuest ? 'guests' : 'users';
    const userRef = doc(db, userCollectionName, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data() as User;
    
    return {
      user_id: userId,
      username: isGuest ? `Guest ${userId.substring(0, 4)}` : userData.username,
      score: weeklyScore.score,
      rank,
      games_played: weeklyScore.games_played,
      games_won: weeklyScore.games_won,
      best_streak: weeklyScore.best_streak
    };
  } catch (error) {
    console.error('Error getting user leaderboard position:', error);
    return null;
  }
} 