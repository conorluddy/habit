// Shared TypeScript types for Atomic Habits Tracker

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export type HabitConfig = {
  name: string;
  frequency: FrequencyType;
  customDays: number[]; // 0=Sun, 6=Sat
  stacking: string;
};

export type TrackerConfig = {
  habitCount: number;
  habits: HabitConfig[];
  months: number;
};
