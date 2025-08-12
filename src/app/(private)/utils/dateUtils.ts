export const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

// Array of days in each month (non-leap year)
export const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const trimmedMonthName = (monthIndex: number): string => {
    const monthName = months[monthIndex];
    const firstThreeChars = monthName.slice(0, 3);
    return firstThreeChars.charAt(0).toUpperCase() + firstThreeChars.slice(1).toLowerCase();
}

/**
 * Returns the number of days in a given month
 * @param monthIndex The month index (0-11, where 0 = January, 11 = December)
 * @param year year parameter to check for leap years
 * @returns The number of days in the month, or 0 if the index is out of range
 */
export const getDaysInMonth = (monthIndex: number, year: number): number => {
  // Return early if the month index is out of range
  if (monthIndex < 0 || monthIndex > 11) {
    return 0;
  }
  
  // February (index 1) in a leap year has 29 days
  if (monthIndex === 1 && year) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeapYear ? 29 : 28;
  }
  
  return daysInMonth[monthIndex];
};


/**
 * Validates and formats year input
 * @param value The input year value
 * @param currentValue The current year value to fallback to if invalid
 * @returns The validated and formatted year value
 */

export const validateYearInput = (value: string, ): boolean => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return false;
    
    // Prevent leading zeros
    if (value.startsWith('0')) return false;

    if (value.length < 4) return false;
    
    return true;
};

/**
 * Returns the first day of the given month and the first day of the next month.
 * Useful for filtering by a full calendar month.
 *
 * @param yearStr - A 4-digit year string, e.g. "2025"
 * @param monthStr - A 1- or 2-digit month string (1 = January, 12 = December)
 * @returns An object containing `start` and `end` in "YYYY-MM-DD" format
 */
export function getMonthDateRange(yearStr: string, monthStr: string): { startDate: string; endDate: string } {
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-based month

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    throw new Error('Invalid year or month input');
  }

  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;

  return { startDate, endDate};
}

/**
 * Formats date components into "YYYY-MM-DD" format
 * @param day - The day of the month (1-31)
 * @param month - The month (1-12)
 * @param year - The 4-digit year
 * @returns A formatted date string in "YYYY-MM-DD" format
 */
export function formatDate(day: string, month: string, year: string): string {
  const formattedDay = day.padStart(2, '0');
  const formattedMonth = month.padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * Extracts the day part from a date string in 'YYYY-MM-DD' format
 * @param dateString - A date string in 'YYYY-MM-DD' format
 * @returns The day part as a string (DD)
 */
export function getDateString(dateString: string): string {
  // Split the date string by '-' and get the day part (index 2)
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return parts[2];
  }
  return '';
}

