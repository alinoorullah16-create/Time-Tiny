import { AgeCalculationResult } from "../types";

export function parseLocalMidnightDate(dateString: string): Date {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getZodiacSign(month: number, day: number): string {
  // month is 1-indexed (1-12)
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn ♑";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius ♒";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces ♓";
  return "Unknown";
}

export function getGenerationCohort(year: number): string {
  if (year <= 1945) return "Silent Generation";
  if (year <= 1964) return "Baby Boomer 🍼";
  if (year <= 1980) return "Generation X 📼";
  if (year <= 1996) return "Millennial (Gen Y) 💾";
  if (year <= 2012) return "Generation Z ⚡";
  return "Generation Alpha 🪐";
}

export function calculateAge(dobStr: string, targetStr: string): AgeCalculationResult {
  const dob = parseLocalMidnightDate(dobStr);
  const target = parseLocalMidnightDate(targetStr);

  let years = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth() - dob.getMonth();
  let days = target.getDate() - dob.getDate();

  if (days < 0) {
    // Get total days in previous month
    const previousMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  const diffTime = target.getTime() - dob.getTime();
  const totalDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.max(0, Math.floor(totalDays / 7));
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayBorn = daysOfWeek[dob.getDay()];

  // Next Birthday details
  let nextBdayYear = target.getFullYear();
  let nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate(), 0, 0, 0, 0);

  if (target >= nextBday) {
    nextBday.setFullYear(nextBdayYear + 1);
  }

  const diffTimeToNextBday = nextBday.getTime() - target.getTime();
  const nextBirthdayDaysRemaining = Math.max(0, Math.ceil(diffTimeToNextBday / (1000 * 60 * 60 * 24)));
  const nextBirthdayAge = years + 1;

  const monthsList = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const formattedNextBday = `${daysOfWeek[nextBday.getDay()]}, ${monthsList[nextBday.getMonth()]} ${nextBday.getDate()}, ${nextBday.getFullYear()}`;

  const zodiacSign = getZodiacSign(dob.getMonth() + 1, dob.getDate());
  const generationCohort = getGenerationCohort(dob.getFullYear());

  return {
    birthDate: dobStr,
    targetDate: targetStr,
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    weekdayBorn,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    nextBirthdayDate: formattedNextBday,
    nextBirthdayDaysRemaining,
    nextBirthdayAge,
    zodiacSign,
    generationCohort,
  };
}

export function reverseCalculateDob(
  years: number,
  months: number,
  days: number,
  referenceDateStr: string
): AgeCalculationResult {
  const referenceDate = parseLocalMidnightDate(referenceDateStr);
  
  // subtract factors accurately
  const dobYear = referenceDate.getFullYear() - years;
  const dobMonth = referenceDate.getMonth() - months;
  const dobDay = referenceDate.getDate() - days;
  
  const dob = new Date(dobYear, dobMonth, dobDay, 0, 0, 0, 0);
  const dobStr = formatDateString(dob);

  return calculateAge(dobStr, referenceDateStr);
}
