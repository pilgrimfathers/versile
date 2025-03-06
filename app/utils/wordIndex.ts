import { differenceInDays, startOfDay } from 'date-fns';

// Helper function to get date in IST (GMT+5:30)
function getISTDate(date: Date): Date {
  // Convert to IST (GMT+5:30)
  const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
  // Get the date components in UTC to avoid timezone shifts
  const istYear = istTime.getUTCFullYear();
  const istMonth = istTime.getUTCMonth();
  const istDay = istTime.getUTCDate();
  // Create a new date with just the date part (time will be 00:00:00)
  return new Date(Date.UTC(istYear, istMonth, istDay));
}

// Define the start date in IST
const START_DATE = getISTDate(new Date('2025-03-03'));

export function getTodayWordIndex(): number {
  // Get today's date in IST
  const today = getISTDate(new Date());
  
  // Calculate days since start date
  const diffDays = differenceInDays(today, START_DATE);
  return Math.max(0, diffDays); // Ensure we don't get negative numbers
} 