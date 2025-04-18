// main.ts
// Ultra-minimal Atomic Habits Printable Tracker

type FrequencyType = 'daily' | 'weekly' | 'custom';

type HabitConfig = {
    name: string;
    frequency: FrequencyType;
    customDays: number[]; // 0=Sun, 6=Sat
    stacking: string;
};

type TrackerConfig = {
    habitCount: number;
    habits: HabitConfig[];
    months: number;
};

const DEFAULT_CONFIG: TrackerConfig = {
    habitCount: 1,
    habits: [
        {
            name: '',
            frequency: 'daily',
            customDays: [],
            stacking: '',
        },
    ],
    months: 1,
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- DOM Elements ---
const appRoot = document.getElementById('app-root')!;
const openDialogBtn = document.getElementById('open-dialog')! as HTMLButtonElement;
const configDialog = document.getElementById('config-dialog')! as HTMLDialogElement;
const configForm = document.getElementById('config-form')! as HTMLFormElement;
const closeDialogBtn = document.getElementById('close-dialog')! as HTMLButtonElement;
const habitCountInput = document.getElementById('habit-count')! as HTMLInputElement;
const monthsInput = document.getElementById('months')! as HTMLInputElement;
const habitsConfigDiv = document.getElementById('habits-config')!;

// --- State ---
let config: TrackerConfig = loadConfig() || DEFAULT_CONFIG;

function saveConfig() {
    localStorage.setItem('trackerConfig', JSON.stringify(config));
}
function loadConfig(): TrackerConfig | null {
    const raw = localStorage.getItem('trackerConfig');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        // Basic validation
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

function updateHabitsConfigUI() {
    const count = Number(habitCountInput.value);
    habitsConfigDiv.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const habit = config.habits[i] || {
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
                ${DAYS_OF_WEEK.map((d, idx) => `
                    <label style="margin-right:0.6em;">
                        <input type="checkbox" name="habit-custom-day-${i}" value="${idx}"${habit.customDays.includes(idx) ? ' checked' : ''} />${d}
                    </label>
                `).join('')}
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

function gatherConfigFromForm(): TrackerConfig {
    const habitCount = Number(habitCountInput.value);
    const months = Number(monthsInput.value);
    const habits: HabitConfig[] = [];
    for (let i = 0; i < habitCount; i++) {
        const name = (document.getElementById(`habit-name-${i}`) as HTMLInputElement).value.trim();
        const frequency = (document.getElementById(`habit-frequency-${i}`) as HTMLSelectElement).value as FrequencyType;
        let customDays: number[] = [];
        if (frequency === 'custom') {
            customDays = Array.from(document.querySelectorAll(`input[name=habit-custom-day-${i}]:checked`)).map(
                (el) => Number((el as HTMLInputElement).value)
            );
        }
        const stacking = (document.getElementById(`habit-stacking-${i}`) as HTMLInputElement).value.trim();
        habits.push({ name, frequency, customDays, stacking });
    }
    return { habitCount, habits, months };
}

function renderTemplate() {
    // Clear root
    appRoot.innerHTML = '';
    // Title
    const title = document.createElement('h1');
    title.textContent = 'Atomic Habits Tracker';
    title.style.fontSize = '1.6em';
    title.style.fontWeight = 'bold';
    title.style.letterSpacing = '0.04em';
    title.style.marginBottom = '0.3em';
    appRoot.appendChild(title);
    // Subtitle
    const subtitle = document.createElement('div');
    subtitle.textContent = `Tracking for ${config.months} month${config.months > 1 ? 's' : ''}`;
    subtitle.style.fontSize = '1em';
    subtitle.style.color = '#555';
    subtitle.style.marginBottom = '1.5em';
    appRoot.appendChild(subtitle);
    // For each habit
    for (let i = 0; i < config.habitCount; i++) {
        const habit = config.habits[i];
        const section = document.createElement('section');
        section.className = 'tracker-section';
        // Habit title
        const habitTitle = document.createElement('div');
        habitTitle.className = 'tracker-title';
        habitTitle.textContent = habit.name || `Habit ${i + 1}`;
        section.appendChild(habitTitle);
        // Stacking statement
        if (habit.stacking) {
            const stacking = document.createElement('div');
            stacking.className = 'tracker-stacking';
            stacking.textContent = habit.stacking;
            section.appendChild(stacking);
        }
        // Frequency label
        const freqLabel = document.createElement('div');
        freqLabel.className = 'tracker-label';
        if (habit.frequency === 'daily') {
            freqLabel.textContent = 'Daily';
        } else if (habit.frequency === 'weekly') {
            freqLabel.textContent = 'Weekly';
        } else {
            freqLabel.textContent = `Custom: ${habit.customDays.map((d) => DAYS_OF_WEEK[d]).join(', ')}`;
        }
        section.appendChild(freqLabel);
        // Grid
        const grid = document.createElement('div');
        grid.className = 'tracker-grid';
        // Determine grid size
        if (habit.frequency === 'daily') {
            // For each month, show days
            for (let m = 0; m < config.months; m++) {
                const monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = `Month ${m + 1}`;
                section.appendChild(monthLabel);
                const daysInMonth = 31; // Keep it simple, max days
                grid.style.gridTemplateColumns = `repeat(31, 18px)`;
                for (let d = 0; d < daysInMonth; d++) {
                    const cell = document.createElement('span');
                    cell.className = 'tracker-cell';
                    cell.title = `Day ${d + 1}`;
                    grid.appendChild(cell);
                }
                section.appendChild(grid.cloneNode(true));
                grid.innerHTML = '';
            }
        } else if (habit.frequency === 'weekly') {
            // For each month, show weeks
            for (let m = 0; m < config.months; m++) {
                const monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = `Month ${m + 1}`;
                section.appendChild(monthLabel);
                grid.style.gridTemplateColumns = `repeat(5, 18px)`;
                for (let w = 0; w < 5; w++) {
                    const cell = document.createElement('span');
                    cell.className = 'tracker-cell';
                    cell.title = `Week ${w + 1}`;
                    grid.appendChild(cell);
                }
                section.appendChild(grid.cloneNode(true));
                grid.innerHTML = '';
            }
        } else if (habit.frequency === 'custom') {
            // For each month, show weeks and only selected days
            for (let m = 0; m < config.months; m++) {
                const monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = `Month ${m + 1}`;
                section.appendChild(monthLabel);
                const weeks = 5;
                const days = habit.customDays.length || 1;
                grid.style.gridTemplateColumns = `repeat(${weeks * days}, 18px)`;
                for (let w = 0; w < weeks; w++) {
                    for (const d of habit.customDays) {
                        const cell = document.createElement('span');
                        cell.className = 'tracker-cell';
                        cell.title = `Week ${w + 1} - ${DAYS_OF_WEEK[d]}`;
                        grid.appendChild(cell);
                    }
                }
                section.appendChild(grid.cloneNode(true));
                grid.innerHTML = '';
            }
        }
        appRoot.appendChild(section);
    }
}

// --- Dialog Logic ---
openDialogBtn.addEventListener('click', () => {
    updateHabitsConfigUI();
    configDialog.showModal();
});
closeDialogBtn.addEventListener('click', () => {
    configDialog.close();
});
habitCountInput.addEventListener('input', () => {
    updateHabitsConfigUI();
});
configForm.addEventListener('submit', (e) => {
    e.preventDefault();
    config = gatherConfigFromForm();
    saveConfig();
    renderTemplate();
    configDialog.close();
});

// --- Initial Render ---
(function init() {
    habitCountInput.value = String(config.habitCount);
    monthsInput.value = String(config.months);
    updateHabitsConfigUI();
    renderTemplate();
})();
