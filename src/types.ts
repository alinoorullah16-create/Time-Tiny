export interface AgeCalculationResult {
  birthDate: string;
  targetDate: string;
  years: number;
  months: number;
  days: number;
  weekdayBorn: string;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthdayDate: string;
  nextBirthdayDaysRemaining: number;
  nextBirthdayAge: number;
  zodiacSign: string;
  generationCohort: string;
}

export interface SavedEvent {
  id: string;
  name: string;
  birthDate: string;
  notifyBeforeDays: number; // 0 for exact day, otherwise days before
  isNotificationEnabled: boolean;
}

export type ApplicationMode = "today" | "specific" | "findDob";
