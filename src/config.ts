// Configuration management for Atomic Habits Tracker
import { TrackerConfig } from './types.js';

const STORAGE_KEY = 'trackerConfig';

export const trackerConfig: TrackerConfig = {
  habitCount: 0,
  habits: [],
  months: 0,
};

export const uiConfig = {
  appTitle: 'Habit Tracker',
  titleFontSize: '1.6em',
  titleFontWeight: 'bold',
  titleLetterSpacing: '0.04em',
  titleMarginBottom: '0.3em',
  subtitleFontSize: '1em',
  subtitleColor: '#555',
  subtitleMarginBottom: '1.5em',
  defaultDaysInMonth: 31,
  cellSize: '18px',
  weeksInMonth: 5,
  labelDaily: 'Daily',
  labelWeekly: 'Weekly',
  labelCustom: 'Days',
  sectionClass: 'tracker-section',
  titleClass: 'tracker-title',
  stackingClass: 'tracker-stacking',
  labelClass: 'tracker-label',
  gridClass: 'tracker-grid',
  weekLabelClass: 'tracker-week-month-label',
  cellClass: 'tracker-cell',
};

export function saveConfig(config: TrackerConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadConfig(): TrackerConfig | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.habitCount === 'number' &&
      Array.isArray(parsed.habits) &&
      typeof parsed.months === 'number'
    ) {
      return parsed;
    }
  } catch {
    // Intentionally ignore JSON parse errors
  }
  return null;
}
