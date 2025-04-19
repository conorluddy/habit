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

// src/tracker-render.ts
function renderTrackerTemplate(trackerConfig) {
  appRoot.innerHTML = "";
  const titleElement = document.createElement("h1");
  titleElement.textContent = uiConfig.appTitle;
  titleElement.style.fontSize = uiConfig.titleFontSize;
  titleElement.style.fontWeight = uiConfig.titleFontWeight;
  titleElement.style.letterSpacing = uiConfig.titleLetterSpacing;
  titleElement.style.marginBottom = uiConfig.titleMarginBottom;
  appRoot.appendChild(titleElement);
  const subtitleElement = document.createElement("div");
  subtitleElement.textContent = `Tracking for ${trackerConfig.months} month${trackerConfig.months > 1 ? "s" : ""}`;
  subtitleElement.style.fontSize = uiConfig.subtitleFontSize;
  subtitleElement.style.color = uiConfig.subtitleColor;
  subtitleElement.style.marginBottom = uiConfig.subtitleMarginBottom;
  appRoot.appendChild(subtitleElement);
  for (let habitIndex = 0; habitIndex < trackerConfig.habitCount; habitIndex++) {
    const habit = trackerConfig.habits[habitIndex];
    const sectionElem = document.createElement("section");
    sectionElem.className = uiConfig.sectionClass;
    const habitTitleElem = document.createElement("div");
    habitTitleElem.className = uiConfig.titleClass;
    habitTitleElem.textContent = habit.name || `Habit ${habitIndex + 1}`;
    sectionElem.appendChild(habitTitleElem);
    if (habit.stacking) {
      const stackingElem = document.createElement("div");
      stackingElem.className = uiConfig.stackingClass;
      stackingElem.textContent = habit.stacking;
      sectionElem.appendChild(stackingElem);
    }
    const freqLabelElem = document.createElement("div");
    freqLabelElem.className = uiConfig.labelClass;
    if (habit.frequency === "daily") {
      freqLabelElem.textContent = uiConfig.labelDaily;
    } else if (habit.frequency === "weekly") {
      freqLabelElem.textContent = uiConfig.labelWeekly;
    } else {
      freqLabelElem.textContent = `${uiConfig.labelCustom}: ${habit.customDays.map((d) => DAYS_OF_WEEK[d]).join(", ")}`;
    }
    sectionElem.appendChild(freqLabelElem);
    const gridElem = document.createElement("div");
    gridElem.className = uiConfig.gridClass;
    if (habit.frequency === "daily") {
      for (let m = 0; m < trackerConfig.months; m++) {
        const monthLabelElem = document.createElement("div");
        monthLabelElem.className = uiConfig.weekLabelClass;
        monthLabelElem.textContent = `Month ${m + 1}`;
        sectionElem.appendChild(monthLabelElem);
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
        sectionElem.appendChild(gridElem.cloneNode(true));
        gridElem.innerHTML = "";
      }
    } else if (habit.frequency === "weekly") {
      const monthsRow = document.createElement("div");
      monthsRow.className = "weekly-months-row";
      for (let m = 0; m < trackerConfig.months; m++) {
        const monthCol = document.createElement("div");
        monthCol.className = "weekly-month-col";
        monthCol.style.display = "flex";
        monthCol.style.flexDirection = "column";
        monthCol.style.alignItems = "center";
        monthCol.style.marginRight = "0.8em";
        if (!trackerConfig.hideMonthLabels) {
          const monthLabelElem = document.createElement("div");
          monthLabelElem.className = uiConfig.weekLabelClass;
          const monthsList = [
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
          let startMonth = 0;
          if (trackerConfig.monthStartCurrent) {
            startMonth = (/* @__PURE__ */ new Date()).getMonth();
          }
          const monthIdx = (startMonth + m) % 12;
          monthLabelElem.textContent = monthsList[monthIdx];
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
      sectionElem.appendChild(monthsRow);
    } else if (habit.frequency === "custom") {
      for (let m = 0; m < trackerConfig.months; m++) {
        const monthFlexRow = document.createElement("div");
        monthFlexRow.className = "month-flex-row";
        if (!trackerConfig.hideMonthLabels) {
          const monthLabelElem = document.createElement("div");
          monthLabelElem.className = uiConfig.weekLabelClass;
          const monthsList = [
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
          let startMonth = 0;
          if (trackerConfig.monthStartCurrent) {
            startMonth = (/* @__PURE__ */ new Date()).getMonth();
          }
          const monthIdx = (startMonth + m) % 12;
          monthLabelElem.textContent = monthsList[monthIdx];
          monthFlexRow.appendChild(monthLabelElem);
        }
        const weeks = uiConfig.weeksInMonth;
        const days = habit.customDays.length || 1;
        gridElem.style.gridTemplateColumns = `repeat(${weeks * days}, ${uiConfig.cellSize})`;
        for (let w = 0; w < weeks; w++) {
          for (const d of habit.customDays) {
            const cellElem = document.createElement("span");
            cellElem.className = uiConfig.cellClass;
            cellElem.title = `Week ${w + 1} - ${DAYS_OF_WEEK[d]}`;
            cellElem.textContent = DAYS_OF_WEEK[d][0];
            gridElem.appendChild(cellElem);
          }
        }
        monthFlexRow.appendChild(gridElem.cloneNode(true));
        gridElem.innerHTML = "";
        sectionElem.appendChild(monthFlexRow);
      }
    }
    appRoot.appendChild(sectionElem);
  }
}

// src/main.ts
var DEFAULT_CONFIG = {
  habitCount: 1,
  habits: [{ name: "", frequency: "daily", customDays: [], stacking: "" }],
  months: 1
};
var config = loadConfig() || DEFAULT_CONFIG;
openDialogBtn.addEventListener("click", () => {
  updateHabitsConfigUI(config);
  configDialog.showModal();
});
closeDialogBtn.addEventListener("click", () => {
  configDialog.close();
});
habitCountInput.addEventListener("input", () => {
  updateHabitsConfigUI(config);
});
configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  config = gatherConfigFromForm();
  saveConfig(config);
  renderTrackerTemplate(config);
  configDialog.close();
});
(function init() {
  habitCountInput.value = String(config.habitCount);
  monthsInput.value = String(config.months);
  updateHabitsConfigUI(config);
  renderTrackerTemplate(config);
})();
