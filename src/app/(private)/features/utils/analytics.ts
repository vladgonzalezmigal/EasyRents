import { FormData } from '@/app/(private)/types/formTypes';

/**
 * Sums the values at a specific column index across all objects in the array
 * @param data Array of FormData objects to sum
 * @param columnIndex The index of the column to sum (1 indexed)
 * @returns The sum of values at the specified column index
 */
export function sumColumn(data: FormData[], columnIndex: number): number {
  if (!data || data.length === 0) {
    return 0;
  }

  // Convert from 1-indexed to 0-indexed for internal processing
  const zeroBasedIndex = columnIndex - 1;

  return data.reduce((total, item) => {
    const keys = Object.keys(item) as (keyof typeof item)[];
    if (zeroBasedIndex >= 0 && zeroBasedIndex < keys.length) {
      const key = keys[zeroBasedIndex];
      const value = item[key];
      
      // Only add if the value is a number
      if (typeof value === 'number') {
        return total + value;
      }
    }
    return total;
  }, 0);
}
