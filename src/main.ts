// main.ts (modularized)
import { TrackerConfig } from './types.js';
import { loadConfig } from './config.js';
import { HabitTrackerRenderer } from './HabitTrackerRenderer.js';
import { attachConfigDialogEvents } from './events.js';
import { updateHabitsConfigUI } from './habits-ui.js';
import { habitCountInput, monthsInput } from './dom.js';

const DEFAULT_CONFIG: TrackerConfig = {
  habitCount: 1,
  habits: [{ name: '', frequency: 'daily', customDays: [], stacking: '' }],
  months: 1,
};

const config: TrackerConfig = loadConfig() || DEFAULT_CONFIG;

(function init() {
  habitCountInput.value = String(config.habitCount);
  monthsInput.value = String(config.months);
  updateHabitsConfigUI(config);
  const renderer = new HabitTrackerRenderer(config);
  renderer.render();
  attachConfigDialogEvents(renderer);
})();
