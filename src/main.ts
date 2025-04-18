// main.ts (modularized)
import { TrackerConfig } from './types.js';
import { loadConfig, saveConfig } from './config.js';
import { appRoot, openDialogBtn, configDialog, configForm, closeDialogBtn, habitCountInput, monthsInput } from './dom.js';
import { updateHabitsConfigUI, gatherConfigFromForm } from './habits-ui.js';
import { renderTemplate } from './tracker-render.js';

const DEFAULT_CONFIG: TrackerConfig = {
    habitCount: 1,
    habits: [
        { name: '', frequency: 'daily', customDays: [], stacking: '' },
    ],
    months: 1,
};

let config: TrackerConfig = loadConfig() || DEFAULT_CONFIG;

openDialogBtn.addEventListener('click', () => {
    updateHabitsConfigUI(config);
    configDialog.showModal();
});
closeDialogBtn.addEventListener('click', () => {
    configDialog.close();
});
habitCountInput.addEventListener('input', () => {
    updateHabitsConfigUI(config);
});
configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    config = gatherConfigFromForm();
    saveConfig(config);
    renderTemplate(config);
    configDialog.close();
});

(function init() {
    habitCountInput.value = String(config.habitCount);
    monthsInput.value = String(config.months);
    updateHabitsConfigUI(config);
    renderTemplate(config);
})();
