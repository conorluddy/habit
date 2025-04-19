/**
 * Utility for month label logic, including month name calculation and start-from-current logic.
 */
import { TrackerConfig } from '../types.js';

/**
 * Returns the month label (e.g., "January") for a given month index and config.
 * @param m - The month index (0-based)
 * @param config - TrackerConfig with monthStartCurrent option
 * @returns The month name string
 */
export function getMonthLabel(m: number, config: TrackerConfig): string {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const start = config.monthStartCurrent ? new Date().getMonth() : 0;
  return months[(start + m) % 12];
}
