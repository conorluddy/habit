// Rendering the printable tracker template
import { TrackerConfig } from './types.js';
import { appRoot } from './dom.js';
import { DAYS_OF_WEEK } from './habits-ui.js';
import { uiConfig } from './config.js';

export function renderTrackerTemplate(trackerConfig: TrackerConfig) {
  appRoot.innerHTML = '';
  const titleElement = document.createElement('h1');
  titleElement.textContent = uiConfig.appTitle;
  titleElement.style.fontSize = uiConfig.titleFontSize;
  titleElement.style.fontWeight = uiConfig.titleFontWeight;
  titleElement.style.letterSpacing = uiConfig.titleLetterSpacing;
  titleElement.style.marginBottom = uiConfig.titleMarginBottom;
  appRoot.appendChild(titleElement);

  const subtitleElement = document.createElement('div');

  subtitleElement.textContent = `Tracking for ${trackerConfig.months} month${trackerConfig.months > 1 ? 's' : ''}`;
  subtitleElement.style.fontSize = uiConfig.subtitleFontSize;
  subtitleElement.style.color = uiConfig.subtitleColor;
  subtitleElement.style.marginBottom = uiConfig.subtitleMarginBottom;
  appRoot.appendChild(subtitleElement);
  for (let habitIndex = 0; habitIndex < trackerConfig.habitCount; habitIndex++) {
    const habit = trackerConfig.habits[habitIndex];
    const sectionElem = document.createElement('section');
    sectionElem.className = uiConfig.sectionClass;
    const habitTitleElem = document.createElement('div');
    habitTitleElem.className = uiConfig.titleClass;
    habitTitleElem.textContent = habit.name || `Habit ${habitIndex + 1}`;
    sectionElem.appendChild(habitTitleElem);
    if (habit.stacking) {
      const stackingElem = document.createElement('div');
      stackingElem.className = uiConfig.stackingClass;
      stackingElem.textContent = habit.stacking;
      sectionElem.appendChild(stackingElem);
    }
    const freqLabelElem = document.createElement('div');
    freqLabelElem.className = uiConfig.labelClass;
    if (habit.frequency === 'daily') {
      freqLabelElem.textContent = uiConfig.labelDaily;
    } else if (habit.frequency === 'weekly') {
      freqLabelElem.textContent = uiConfig.labelWeekly;
    } else {
      freqLabelElem.textContent = `${uiConfig.labelCustom}: ${habit.customDays.map((d: number) => DAYS_OF_WEEK[d]).join(', ')}`;
    }
    sectionElem.appendChild(freqLabelElem);
    const gridElem = document.createElement('div');
    gridElem.className = uiConfig.gridClass;
    if (habit.frequency === 'daily') {
      for (let m = 0; m < trackerConfig.months; m++) {
        const monthLabelElem = document.createElement('div');
        monthLabelElem.className = uiConfig.weekLabelClass;
        monthLabelElem.textContent = `Month ${m + 1}`;
        sectionElem.appendChild(monthLabelElem);
        const daysInMonth = uiConfig.defaultDaysInMonth;
        gridElem.style.gridTemplateColumns = `repeat(${daysInMonth}, ${uiConfig.cellSize})`;
        for (let d = 0; d < daysInMonth; d++) {
          const cellElem = document.createElement('span');
          cellElem.className = uiConfig.cellClass;
          cellElem.title = `Day ${d + 1}`;
          const dayIdx = d % 7;
          cellElem.textContent = DAYS_OF_WEEK[dayIdx][0];
          gridElem.appendChild(cellElem);
        }
        sectionElem.appendChild(gridElem.cloneNode(true));
        gridElem.innerHTML = '';
      }
    } else if (habit.frequency === 'weekly') {
      // Render weekly mode as a grid: each month is a column, label above, 5 week cells below
      const monthsRow = document.createElement('div');
      monthsRow.className = 'weekly-months-row';
      for (let m = 0; m < trackerConfig.months; m++) {
        const monthCol = document.createElement('div');
        monthCol.className = 'weekly-month-col';
        monthCol.style.display = 'flex';
        monthCol.style.flexDirection = 'column';
        monthCol.style.alignItems = 'center';
        monthCol.style.marginRight = '0.8em';
        // Month label logic
        if (!trackerConfig.hideMonthLabels) {
          const monthLabelElem = document.createElement('div');
          monthLabelElem.className = uiConfig.weekLabelClass;
          const monthsList = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          let startMonth = 0;
          if (trackerConfig.monthStartCurrent) {
            startMonth = new Date().getMonth();
          }
          const monthIdx = (startMonth + m) % 12;
          monthLabelElem.textContent = monthsList[monthIdx];
          monthCol.appendChild(monthLabelElem);
        }
        const weeksRow = document.createElement('div');
        weeksRow.className = 'weekly-month-weeks-row';
        weeksRow.style.display = 'flex';
        weeksRow.style.flexDirection = 'row';
        weeksRow.style.gap = '0.2em';
        for (let w = 0; w < uiConfig.weeksInMonth; w++) {
          const cellElem = document.createElement('span');
          cellElem.className = uiConfig.cellClass;
          cellElem.title = `Week ${w + 1}`;
          weeksRow.appendChild(cellElem);
        }
        monthCol.appendChild(weeksRow);
        monthsRow.appendChild(monthCol);
      }
      sectionElem.appendChild(monthsRow);
    } else if (habit.frequency === 'custom') {
      for (let m = 0; m < trackerConfig.months; m++) {
        const monthFlexRow = document.createElement('div');
        monthFlexRow.className = 'month-flex-row';
        // Month label logic
        if (!trackerConfig.hideMonthLabels) {
          const monthLabelElem = document.createElement('div');
          monthLabelElem.className = uiConfig.weekLabelClass;
          const monthsList = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];
          let startMonth = 0;
          if (trackerConfig.monthStartCurrent) {
            startMonth = new Date().getMonth();
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
            const cellElem = document.createElement('span');
            cellElem.className = uiConfig.cellClass;
            cellElem.title = `Week ${w + 1} - ${DAYS_OF_WEEK[d]}`;
            cellElem.textContent = DAYS_OF_WEEK[d][0];
            gridElem.appendChild(cellElem);
          }
        }
        monthFlexRow.appendChild(gridElem.cloneNode(true));
        gridElem.innerHTML = '';
        sectionElem.appendChild(monthFlexRow);
      }
    }
    appRoot.appendChild(sectionElem);
  }
}
