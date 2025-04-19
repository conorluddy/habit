// src/config.ts
var STORAGE_KEY = "trackerConfig";
var uiConfig = {
  appTitle: "Habit Tracker",
  titleFontSize: "1.6em",
  titleFontWeight: "bold",
  titleLetterSpacing: "0.04em",
  titleMarginBottom: "0.3em",
  subtitleFontSize: "1em",
  subtitleColor: "#555",
  subtitleMarginBottom: "1.5em",
  defaultDaysInMonth: 31,
  cellSize: "18px",
  weeksInMonth: 5,
  labelDaily: "Daily",
  labelWeekly: "Weekly",
  labelCustom: "Days",
  sectionClass: "tracker-section",
  titleClass: "tracker-title",
  stackingClass: "tracker-stacking",
  labelClass: "tracker-label",
  gridClass: "tracker-grid",
  weekLabelClass: "tracker-week-month-label",
  cellClass: "tracker-cell"
};
function saveConfig(config2) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config2));
}
function loadConfig() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.habitCount === "number" && Array.isArray(parsed.habits) && typeof parsed.months === "number") {
      return parsed;
    }
  } catch {
  }
  return null;
}

// src/dom.ts
var appRoot = document.getElementById("app-root");
var openDialogBtn = document.getElementById("open-dialog");
var configDialog = document.getElementById("config-dialog");
var configForm = document.getElementById("config-form");
var closeDialogBtn = document.getElementById("close-dialog");
var habitCountInput = document.getElementById("habit-count");
var monthsInput = document.getElementById("months");
var habitsConfigDiv = document.getElementById("habits-config");

// src/habits-ui.ts
var DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
function updateHabitsConfigUI(config2) {
  const count = Number(habitCountInput.value);
  habitsConfigDiv.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const habit = config2.habits[i] || {
      name: "",
      frequency: "daily",
      customDays: [],
      stacking: ""
    };
    const section = document.createElement("section");
    section.innerHTML = `
            <label for="habit-name-${i}">Habit ${i + 1} Name:</label>
            <input type="text" id="habit-name-${i}" name="habit-name-${i}" value="${habit.name}" maxlength="32" />
            <label for="habit-frequency-${i}">Frequency:</label>
            <select id="habit-frequency-${i}" name="habit-frequency-${i}">
                <option value="daily"${habit.frequency === "daily" ? " selected" : ""}>Daily</option>
                <option value="weekly"${habit.frequency === "weekly" ? " selected" : ""}>Weekly</option>
                <option value="custom"${habit.frequency === "custom" ? " selected" : ""}>Custom Days</option>
            </select>
            <div class="custom-days-row" id="custom-days-row-${i}" style="display:${habit.frequency === "custom" ? "block" : "none"};margin-bottom:0.7em;">
                <span>Days:</span>
                ${DAYS_OF_WEEK.map(
      (d, idx) => `
                    <label style="margin-right:0.6em;">
                        <input type="checkbox" name="habit-custom-day-${i}" value="${idx}"${habit.customDays.includes(idx) ? " checked" : ""} />${d}
                    </label>
                `
    ).join("")}
            </div>
            <label for="habit-stacking-${i}">Habit Stacking Statement:</label>
            <input type="text" id="habit-stacking-${i}" name="habit-stacking-${i}" value="${habit.stacking}" maxlength="64" placeholder="After I do X, I'll do this habit" />
        `;
    habitsConfigDiv.appendChild(section);
  }
  for (let i = 0; i < count; i++) {
    const freqSelect = document.getElementById(`habit-frequency-${i}`);
    const customDaysRow = document.getElementById(`custom-days-row-${i}`);
    freqSelect.addEventListener("change", () => {
      customDaysRow.style.display = freqSelect.value === "custom" ? "block" : "none";
    });
  }
}
function gatherConfigFromForm() {
  const habitCount = Number(habitCountInput.value);
  const months = Number(document.getElementById("months").value);
  const monthStartCurrent = document.getElementById("month-start-current").checked;
  const hideMonthLabels = document.getElementById("hide-month-labels").checked;
  const habits = [];
  for (let i = 0; i < habitCount; i++) {
    const name = document.getElementById(`habit-name-${i}`).value.trim();
    const frequency = document.getElementById(`habit-frequency-${i}`).value;
    let customDays = [];
    if (frequency === "custom") {
      customDays = Array.from(
        document.querySelectorAll(`input[name=habit-custom-day-${i}]:checked`)
      ).map((el) => Number(el.value));
    }
    const stacking = document.getElementById(`habit-stacking-${i}`).value.trim();
    habits.push({ name, frequency, customDays, stacking });
  }
  return { habitCount, habits, months, monthStartCurrent, hideMonthLabels };
}

// src/utils/months.ts
function getMonthLabel(m, config2) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const start = config2.monthStartCurrent ? (/* @__PURE__ */ new Date()).getMonth() : 0;
  return months[(start + m) % 12];
}

// src/utils/render.ts
function renderMonthBlock(label, grid, labelClass = "tracker-week-month-label") {
  const row = document.createElement("div");
  row.className = "month-flex-row";
  if (label) {
    const labelElem = document.createElement("div");
    labelElem.className = labelClass;
    labelElem.textContent = label;
    row.appendChild(labelElem);
  }
  row.appendChild(grid);
  return row;
}

// src/HabitSection.ts
var HabitSection = class {
  constructor(habit, trackerConfig) {
    this.habit = habit;
    this.trackerConfig = trackerConfig;
  }
  render() {
    const sectionElem = document.createElement("section");
    sectionElem.className = uiConfig.sectionClass;
    const habitTitleElem = document.createElement("div");
    habitTitleElem.className = uiConfig.titleClass;
    habitTitleElem.textContent = this.habit.name || "Habit";
    sectionElem.appendChild(habitTitleElem);
    if (this.habit.stacking) {
      const stackingElem = document.createElement("div");
      stackingElem.className = uiConfig.stackingClass;
      stackingElem.textContent = this.habit.stacking;
      sectionElem.appendChild(stackingElem);
    }
    const freqLabelElem = document.createElement("div");
    freqLabelElem.className = uiConfig.labelClass;
    if (this.habit.frequency === "daily") {
      freqLabelElem.textContent = uiConfig.labelDaily;
    } else if (this.habit.frequency === "weekly") {
      freqLabelElem.textContent = uiConfig.labelWeekly;
    } else {
      freqLabelElem.textContent = `${uiConfig.labelCustom}: ${this.habit.customDays.map((d) => DAYS_OF_WEEK[d]).join(", ")}`;
    }
    sectionElem.appendChild(freqLabelElem);
    sectionElem.appendChild(this.renderGrid());
    return sectionElem;
  }
  renderGrid() {
    const gridElem = document.createElement("div");
    gridElem.className = uiConfig.gridClass;
    if (this.habit.frequency === "daily") {
      return this.renderDaily(gridElem);
    } else if (this.habit.frequency === "weekly") {
      return this.renderWeekly();
    } else {
      return this.renderCustom(gridElem);
    }
  }
  renderDaily(gridElem) {
    const container = document.createElement("div");
    for (let m = 0; m < this.trackerConfig.months; m++) {
      const label = this.trackerConfig.hideMonthLabels ? null : getMonthLabel(m, this.trackerConfig);
      gridElem.innerHTML = "";
      const daysInMonth = uiConfig.defaultDaysInMonth;
      gridElem.style.gridTemplateColumns = `repeat(${daysInMonth}, ${uiConfig.cellSize})`;
      for (let d = 0; d < daysInMonth; d++) {
        const cellElem = document.createElement("span");
        cellElem.className = uiConfig.cellClass;
        cellElem.title = `Day ${d + 1}`;
        const dayIdx = d % 7;
        cellElem.textContent = DAYS_OF_WEEK[dayIdx][0];
        gridElem.appendChild(cellElem);
      }
      container.appendChild(renderMonthBlock(label, gridElem.cloneNode(true)));
    }
    return container;
  }
  renderWeekly() {
    const monthsRow = document.createElement("div");
    monthsRow.className = "weekly-months-row";
    for (let m = 0; m < this.trackerConfig.months; m++) {
      const monthCol = document.createElement("div");
      monthCol.className = "weekly-month-col";
      monthCol.style.display = "flex";
      monthCol.style.flexDirection = "column";
      monthCol.style.alignItems = "center";
      monthCol.style.marginRight = "0.8em";
      if (!this.trackerConfig.hideMonthLabels) {
        const monthLabelElem = document.createElement("div");
        monthLabelElem.className = uiConfig.weekLabelClass;
        monthLabelElem.textContent = getMonthLabel(m, this.trackerConfig);
        monthCol.appendChild(monthLabelElem);
      }
      const weeksRow = document.createElement("div");
      weeksRow.className = "weekly-month-weeks-row";
      weeksRow.style.display = "flex";
      weeksRow.style.flexDirection = "row";
      weeksRow.style.gap = "0.2em";
      for (let w = 0; w < uiConfig.weeksInMonth; w++) {
        const cellElem = document.createElement("span");
        cellElem.className = uiConfig.cellClass;
        cellElem.title = `Week ${w + 1}`;
        weeksRow.appendChild(cellElem);
      }
      monthCol.appendChild(weeksRow);
      monthsRow.appendChild(monthCol);
    }
    return monthsRow;
  }
  renderCustom(gridElem) {
    const container = document.createElement("div");
    for (let m = 0; m < this.trackerConfig.months; m++) {
      const label = this.trackerConfig.hideMonthLabels ? null : getMonthLabel(m, this.trackerConfig);
      gridElem.innerHTML = "";
      const weeks = uiConfig.weeksInMonth;
      const days = this.habit.customDays.length || 1;
      gridElem.style.gridTemplateColumns = `repeat(${weeks * days}, ${uiConfig.cellSize})`;
      for (let w = 0; w < weeks; w++) {
        for (const d of this.habit.customDays) {
          const cellElem = document.createElement("span");
          cellElem.className = uiConfig.cellClass;
          cellElem.title = `Week ${w + 1} - ${DAYS_OF_WEEK[d]}`;
          cellElem.textContent = DAYS_OF_WEEK[d][0];
          gridElem.appendChild(cellElem);
        }
      }
      container.appendChild(renderMonthBlock(label, gridElem.cloneNode(true)));
    }
    return container;
  }
};

// src/HabitTrackerRenderer.ts
var HabitTrackerRenderer = class {
  constructor(trackerConfig) {
    this.trackerConfig = trackerConfig;
  }
  render() {
    appRoot.innerHTML = "";
    const titleElement = document.createElement("h1");
    titleElement.textContent = uiConfig.appTitle;
    titleElement.style.fontSize = uiConfig.titleFontSize;
    titleElement.style.fontWeight = uiConfig.titleFontWeight;
    titleElement.style.letterSpacing = uiConfig.titleLetterSpacing;
    titleElement.style.marginBottom = uiConfig.titleMarginBottom;
    appRoot.appendChild(titleElement);
    const subtitleElement = document.createElement("div");
    subtitleElement.textContent = `Tracking for ${this.trackerConfig.months} month${this.trackerConfig.months > 1 ? "s" : ""}`;
    subtitleElement.style.fontSize = uiConfig.subtitleFontSize;
    subtitleElement.style.color = uiConfig.subtitleColor;
    subtitleElement.style.marginBottom = uiConfig.subtitleMarginBottom;
    appRoot.appendChild(subtitleElement);
    for (let i = 0; i < this.trackerConfig.habitCount; i++) {
      const habit = this.trackerConfig.habits[i];
      const section = new HabitSection(habit, this.trackerConfig);
      appRoot.appendChild(section.render());
    }
  }
  updateConfig(config2) {
    this.trackerConfig = config2;
    this.render();
  }
};

// src/events.ts
function attachConfigDialogEvents(renderer) {
  openDialogBtn.addEventListener("click", () => {
    updateHabitsConfigUI(renderer["trackerConfig"]);
    configDialog.showModal();
  });
  closeDialogBtn.addEventListener("click", () => {
    configDialog.close();
  });
  habitCountInput.addEventListener("input", () => {
    updateHabitsConfigUI(renderer["trackerConfig"]);
  });
  configForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const config2 = gatherConfigFromForm();
    saveConfig(config2);
    renderer.updateConfig(config2);
    configDialog.close();
  });
}

// src/main.ts
var DEFAULT_CONFIG = {
  habitCount: 1,
  habits: [{ name: "", frequency: "daily", customDays: [], stacking: "" }],
  months: 1
};
var config = loadConfig() || DEFAULT_CONFIG;
(function init() {
  habitCountInput.value = String(config.habitCount);
  monthsInput.value = String(config.months);
  updateHabitsConfigUI(config);
  const renderer = new HabitTrackerRenderer(config);
  renderer.render();
  attachConfigDialogEvents(renderer);
})();
