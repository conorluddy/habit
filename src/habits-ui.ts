// UI logic for the configuration modal/dialog
import { TrackerConfig, HabitConfig, FrequencyType } from './types.js';
import { habitCountInput, habitsConfigDiv } from './dom.js';

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function updateHabitsConfigUI(config: TrackerConfig) {
  const count = Number(habitCountInput.value);
  habitsConfigDiv.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const habit: HabitConfig = config.habits[i] || {
      name: '',
      frequency: 'daily',
      customDays: [],
      stacking: '',
    };
    const section = document.createElement('section');
    section.innerHTML = `
            <label for="habit-name-${i}">Habit ${i + 1} Name:</label>
            <input type="text" id="habit-name-${i}" name="habit-name-${i}" value="${habit.name}" maxlength="32" />
            <label for="habit-frequency-${i}">Frequency:</label>
            <select id="habit-frequency-${i}" name="habit-frequency-${i}">
                <option value="daily"${habit.frequency === 'daily' ? ' selected' : ''}>Daily</option>
                <option value="weekly"${habit.frequency === 'weekly' ? ' selected' : ''}>Weekly</option>
                <option value="custom"${habit.frequency === 'custom' ? ' selected' : ''}>Custom Days</option>
            </select>
            <div class="custom-days-row" id="custom-days-row-${i}" style="display:${habit.frequency === 'custom' ? 'block' : 'none'};margin-bottom:0.7em;">
                <span>Days:</span>
                ${DAYS_OF_WEEK.map(
                  (d, idx) => `
                    <label style="margin-right:0.6em;">
                        <input type="checkbox" name="habit-custom-day-${i}" value="${idx}"${habit.customDays.includes(idx) ? ' checked' : ''} />${d}
                    </label>
                `,
                ).join('')}
            </div>
            <label for="habit-stacking-${i}">Habit Stacking Statement:</label>
            <input type="text" id="habit-stacking-${i}" name="habit-stacking-${i}" value="${habit.stacking}" maxlength="64" placeholder="After I do X, I'll do this habit" />
        `;
    habitsConfigDiv.appendChild(section);
  }
  // Attach event listeners for frequency changes
  for (let i = 0; i < count; i++) {
    const freqSelect = document.getElementById(`habit-frequency-${i}`) as HTMLSelectElement;
    const customDaysRow = document.getElementById(`custom-days-row-${i}`)!;
    freqSelect.addEventListener('change', () => {
      customDaysRow.style.display = freqSelect.value === 'custom' ? 'block' : 'none';
    });
  }
}

export function gatherConfigFromForm(): TrackerConfig {
  const habitCount = Number(habitCountInput.value);
  const months = Number((document.getElementById('months') as HTMLInputElement).value);
  const habits: HabitConfig[] = [];
  for (let i = 0; i < habitCount; i++) {
    const name = (document.getElementById(`habit-name-${i}`) as HTMLInputElement).value.trim();
    const frequency = (document.getElementById(`habit-frequency-${i}`) as HTMLSelectElement)
      .value as FrequencyType;
    let customDays: number[] = [];
    if (frequency === 'custom') {
      customDays = Array.from(
        document.querySelectorAll(`input[name=habit-custom-day-${i}]:checked`),
      ).map((el) => Number((el as HTMLInputElement).value));
    }
    const stacking = (
      document.getElementById(`habit-stacking-${i}`) as HTMLInputElement
    ).value.trim();
    habits.push({ name, frequency, customDays, stacking });
  }
  return { habitCount, habits, months };
}
