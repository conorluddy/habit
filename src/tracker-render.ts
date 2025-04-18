// Rendering the printable tracker template
import { TrackerConfig, FrequencyType } from './types.js';
import { appRoot } from './dom.js';
import { DAYS_OF_WEEK } from './habits-ui.js';

export function renderTemplate(config: TrackerConfig) {
    appRoot.innerHTML = '';
    const title = document.createElement('h1');
    title.textContent = 'Atomic Habits Tracker';
    title.style.fontSize = '1.6em';
    title.style.fontWeight = 'bold';
    title.style.letterSpacing = '0.04em';
    title.style.marginBottom = '0.3em';
    appRoot.appendChild(title);
    const subtitle = document.createElement('div');
    subtitle.textContent = `Tracking for ${config.months} month${config.months > 1 ? 's' : ''}`;
    subtitle.style.fontSize = '1em';
    subtitle.style.color = '#555';
    subtitle.style.marginBottom = '1.5em';
    appRoot.appendChild(subtitle);
    for (let i = 0; i < config.habitCount; i++) {
        const habit = config.habits[i];
        const section = document.createElement('section');
        section.className = 'tracker-section';
        const habitTitle = document.createElement('div');
        habitTitle.className = 'tracker-title';
        habitTitle.textContent = habit.name || `Habit ${i + 1}`;
        section.appendChild(habitTitle);
        if (habit.stacking) {
            const stacking = document.createElement('div');
            stacking.className = 'tracker-stacking';
            stacking.textContent = habit.stacking;
            section.appendChild(stacking);
        }
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
        const grid = document.createElement('div');
        grid.className = 'tracker-grid';
        if (habit.frequency === 'daily') {
            for (let m = 0; m < config.months; m++) {
                const monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = `Month ${m + 1}`;
                section.appendChild(monthLabel);
                const daysInMonth = 31;
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
