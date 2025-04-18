// Configuration management for Atomic Habits Tracker
import { TrackerConfig } from './types.js';

const STORAGE_KEY = 'trackerConfig';

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
    } catch {}
    return null;
}
