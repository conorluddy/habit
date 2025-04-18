// main.ts
// Ultra-minimal Atomic Habits Printable Tracker
var DEFAULT_CONFIG = {
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
var DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// --- DOM Elements ---
var appRoot = document.getElementById('app-root');
var openDialogBtn = document.getElementById('open-dialog');
var configDialog = document.getElementById('config-dialog');
var configForm = document.getElementById('config-form');
var closeDialogBtn = document.getElementById('close-dialog');
var habitCountInput = document.getElementById('habit-count');
var monthsInput = document.getElementById('months');
var habitsConfigDiv = document.getElementById('habits-config');
// --- State ---
var config = loadConfig() || DEFAULT_CONFIG;
function saveConfig() {
    localStorage.setItem('trackerConfig', JSON.stringify(config));
}
function loadConfig() {
    var raw = localStorage.getItem('trackerConfig');
    if (!raw)
        return null;
    try {
        var parsed = JSON.parse(raw);
        // Basic validation
        if (typeof parsed.habitCount === 'number' &&
            Array.isArray(parsed.habits) &&
            typeof parsed.months === 'number') {
            return parsed;
        }
    }
    catch (_a) { }
    return null;
}
function updateHabitsConfigUI() {
    var count = Number(habitCountInput.value);
    habitsConfigDiv.innerHTML = '';
    var _loop_1 = function (i) {
        var habit = config.habits[i] || {
            name: '',
            frequency: 'daily',
            customDays: [],
            stacking: '',
        };
        var section = document.createElement('section');
        section.innerHTML = "\n            <label for=\"habit-name-".concat(i, "\">Habit ").concat(i + 1, " Name:</label>\n            <input type=\"text\" id=\"habit-name-").concat(i, "\" name=\"habit-name-").concat(i, "\" value=\"").concat(habit.name, "\" maxlength=\"32\" />\n            <label for=\"habit-frequency-").concat(i, "\">Frequency:</label>\n            <select id=\"habit-frequency-").concat(i, "\" name=\"habit-frequency-").concat(i, "\">\n                <option value=\"daily\"").concat(habit.frequency === 'daily' ? ' selected' : '', ">Daily</option>\n                <option value=\"weekly\"").concat(habit.frequency === 'weekly' ? ' selected' : '', ">Weekly</option>\n                <option value=\"custom\"").concat(habit.frequency === 'custom' ? ' selected' : '', ">Custom Days</option>\n            </select>\n            <div class=\"custom-days-row\" id=\"custom-days-row-").concat(i, "\" style=\"display:").concat(habit.frequency === 'custom' ? 'block' : 'none', ";margin-bottom:0.7em;\">\n                <span>Days:</span>\n                ").concat(DAYS_OF_WEEK.map(function (d, idx) { return "\n                    <label style=\"margin-right:0.6em;\">\n                        <input type=\"checkbox\" name=\"habit-custom-day-".concat(i, "\" value=\"").concat(idx, "\"").concat(habit.customDays.includes(idx) ? ' checked' : '', " />").concat(d, "\n                    </label>\n                "); }).join(''), "\n            </div>\n            <label for=\"habit-stacking-").concat(i, "\">Habit Stacking Statement:</label>\n            <input type=\"text\" id=\"habit-stacking-").concat(i, "\" name=\"habit-stacking-").concat(i, "\" value=\"").concat(habit.stacking, "\" maxlength=\"64\" placeholder=\"After I do X, I'll do this habit\" />\n        ");
        habitsConfigDiv.appendChild(section);
    };
    for (var i = 0; i < count; i++) {
        _loop_1(i);
    }
    var _loop_2 = function (i) {
        var freqSelect = document.getElementById("habit-frequency-".concat(i));
        var customDaysRow = document.getElementById("custom-days-row-".concat(i));
        freqSelect.addEventListener('change', function () {
            customDaysRow.style.display = freqSelect.value === 'custom' ? 'block' : 'none';
        });
    };
    // Attach event listeners for frequency changes
    for (var i = 0; i < count; i++) {
        _loop_2(i);
    }
}
function gatherConfigFromForm() {
    var habitCount = Number(habitCountInput.value);
    var months = Number(monthsInput.value);
    var habits = [];
    for (var i = 0; i < habitCount; i++) {
        var name_1 = document.getElementById("habit-name-".concat(i)).value.trim();
        var frequency = document.getElementById("habit-frequency-".concat(i)).value;
        var customDays = [];
        if (frequency === 'custom') {
            customDays = Array.from(document.querySelectorAll("input[name=habit-custom-day-".concat(i, "]:checked"))).map(function (el) { return Number(el.value); });
        }
        var stacking = document.getElementById("habit-stacking-".concat(i)).value.trim();
        habits.push({ name: name_1, frequency: frequency, customDays: customDays, stacking: stacking });
    }
    return { habitCount: habitCount, habits: habits, months: months };
}
function renderTemplate() {
    // Clear root
    appRoot.innerHTML = '';
    // Title
    var title = document.createElement('h1');
    title.textContent = 'Atomic Habits Tracker';
    title.style.fontSize = '1.6em';
    title.style.fontWeight = 'bold';
    title.style.letterSpacing = '0.04em';
    title.style.marginBottom = '0.3em';
    appRoot.appendChild(title);
    // Subtitle
    var subtitle = document.createElement('div');
    subtitle.textContent = "Tracking for ".concat(config.months, " month").concat(config.months > 1 ? 's' : '');
    subtitle.style.fontSize = '1em';
    subtitle.style.color = '#555';
    subtitle.style.marginBottom = '1.5em';
    appRoot.appendChild(subtitle);
    // For each habit
    for (var i = 0; i < config.habitCount; i++) {
        var habit = config.habits[i];
        var section = document.createElement('section');
        section.className = 'tracker-section';
        // Habit title
        var habitTitle = document.createElement('div');
        habitTitle.className = 'tracker-title';
        habitTitle.textContent = habit.name || "Habit ".concat(i + 1);
        section.appendChild(habitTitle);
        // Stacking statement
        if (habit.stacking) {
            var stacking = document.createElement('div');
            stacking.className = 'tracker-stacking';
            stacking.textContent = habit.stacking;
            section.appendChild(stacking);
        }
        // Frequency label
        var freqLabel = document.createElement('div');
        freqLabel.className = 'tracker-label';
        if (habit.frequency === 'daily') {
            freqLabel.textContent = 'Daily';
        }
        else if (habit.frequency === 'weekly') {
            freqLabel.textContent = 'Weekly';
        }
        else {
            freqLabel.textContent = "Custom: ".concat(habit.customDays.map(function (d) { return DAYS_OF_WEEK[d]; }).join(', '));
        }
        section.appendChild(freqLabel);
        // Grid
        var grid = document.createElement('div');
        grid.className = 'tracker-grid';
        // Determine grid size
        if (habit.frequency === 'daily') {
            // For each month, show days
            for (var m = 0; m < config.months; m++) {
                var monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = "Month ".concat(m + 1);
                section.appendChild(monthLabel);
                var daysInMonth = 31; // Keep it simple, max days
                grid.style.gridTemplateColumns = "repeat(31, 18px)";
                for (var d = 0; d < daysInMonth; d++) {
                    var cell = document.createElement('span');
                    cell.className = 'tracker-cell';
                    cell.title = "Day ".concat(d + 1);
                    grid.appendChild(cell);
                }
                section.appendChild(grid.cloneNode(true));
                grid.innerHTML = '';
            }
        }
        else if (habit.frequency === 'weekly') {
            // For each month, show weeks
            for (var m = 0; m < config.months; m++) {
                var monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = "Month ".concat(m + 1);
                section.appendChild(monthLabel);
                grid.style.gridTemplateColumns = "repeat(5, 18px)";
                for (var w = 0; w < 5; w++) {
                    var cell = document.createElement('span');
                    cell.className = 'tracker-cell';
                    cell.title = "Week ".concat(w + 1);
                    grid.appendChild(cell);
                }
                section.appendChild(grid.cloneNode(true));
                grid.innerHTML = '';
            }
        }
        else if (habit.frequency === 'custom') {
            // For each month, show weeks and only selected days
            for (var m = 0; m < config.months; m++) {
                var monthLabel = document.createElement('div');
                monthLabel.className = 'tracker-week-label';
                monthLabel.textContent = "Month ".concat(m + 1);
                section.appendChild(monthLabel);
                var weeks = 5;
                var days = habit.customDays.length || 1;
                grid.style.gridTemplateColumns = "repeat(".concat(weeks * days, ", 18px)");
                for (var w = 0; w < weeks; w++) {
                    for (var _i = 0, _a = habit.customDays; _i < _a.length; _i++) {
                        var d = _a[_i];
                        var cell = document.createElement('span');
                        cell.className = 'tracker-cell';
                        cell.title = "Week ".concat(w + 1, " - ").concat(DAYS_OF_WEEK[d]);
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
openDialogBtn.addEventListener('click', function () {
    updateHabitsConfigUI();
    configDialog.showModal();
});
closeDialogBtn.addEventListener('click', function () {
    configDialog.close();
});
habitCountInput.addEventListener('input', function () {
    updateHabitsConfigUI();
});
configForm.addEventListener('submit', function (e) {
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
