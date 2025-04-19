/**
 * All event listeners for config dialog, form submission, input changes, etc.
 * Keeps event logic separate from rendering for maintainability.
 */
import { HabitTrackerRenderer } from './HabitTrackerRenderer.js';
import { saveConfig } from './config.js';
import { updateHabitsConfigUI, gatherConfigFromForm } from './habits-ui.js';
import {
  openDialogBtn,
  configDialog,
  configForm,
  closeDialogBtn,
  habitCountInput,

} from './dom.js';

/**
 * Attaches all configuration dialog and form event handlers to the UI.
 * @param renderer - The HabitTrackerRenderer instance to update on config changes.
 */
export function attachConfigDialogEvents(renderer: HabitTrackerRenderer) {
  openDialogBtn.addEventListener('click', () => {
    updateHabitsConfigUI(renderer['trackerConfig']);
    configDialog.showModal();
  });
  closeDialogBtn.addEventListener('click', () => {
    configDialog.close();
  });
  habitCountInput.addEventListener('input', () => {
    updateHabitsConfigUI(renderer['trackerConfig']);
  });
  configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const config = gatherConfigFromForm();
    saveConfig(config);
    renderer.updateConfig(config);
    configDialog.close();
  });
}
