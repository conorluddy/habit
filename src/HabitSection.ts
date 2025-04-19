// Encapsulates rendering of a single habit section
import { HabitConfig, TrackerConfig } from './types.js';
import { DAYS_OF_WEEK } from './habits-ui.js';
import { uiConfig } from './config.js';
import { getMonthLabel } from './utils/months.js';
import { renderMonthBlock } from './utils/render.js';

/**
 * Represents and renders a single habit section in the tracker, including title, stacking, frequency label, and tracker grid.
 * Encapsulates all logic for rendering a habit's data.
 */
export class HabitSection {
  /**
   * Creates a HabitSection instance.
   * @param habit - The configuration for the habit to render.
   * @param trackerConfig - The overall tracker configuration.
   */
  constructor(private habit: HabitConfig, private trackerConfig: TrackerConfig) {}

  /**
   * Renders the full habit section as a DOM element.
   * @returns The section element containing the habit's tracker UI.
   */
  render(): HTMLElement {
    const sectionElem = document.createElement('section');
    sectionElem.className = uiConfig.sectionClass;
    // Title
    const habitTitleElem = document.createElement('div');
    habitTitleElem.className = uiConfig.titleClass;
    habitTitleElem.textContent = this.habit.name || 'Habit';
    sectionElem.appendChild(habitTitleElem);
    // Stacking
    if (this.habit.stacking) {
      const stackingElem = document.createElement('div');
      stackingElem.className = uiConfig.stackingClass;
      stackingElem.textContent = this.habit.stacking;
      sectionElem.appendChild(stackingElem);
    }
    // Frequency label
    const freqLabelElem = document.createElement('div');
    freqLabelElem.className = uiConfig.labelClass;
    if (this.habit.frequency === 'daily') {
      freqLabelElem.textContent = uiConfig.labelDaily;
    } else if (this.habit.frequency === 'weekly') {
      freqLabelElem.textContent = uiConfig.labelWeekly;
    } else {
      freqLabelElem.textContent = `${uiConfig.labelCustom}: ${this.habit.customDays.map((d: number) => DAYS_OF_WEEK[d]).join(', ')}`;
    }
    sectionElem.appendChild(freqLabelElem);
    // Render tracker grid for this habit
    sectionElem.appendChild(this.renderGrid());
    return sectionElem;
  }

  /**
   * Renders the tracker grid for the habit, based on frequency.
   * @returns The grid element (container for daily/custom, monthsRow for weekly)
   */
  private renderGrid(): HTMLElement {
    const gridElem = document.createElement('div');
    gridElem.className = uiConfig.gridClass;
    if (this.habit.frequency === 'daily') {
      return this.renderDaily(gridElem);
    } else if (this.habit.frequency === 'weekly') {
      return this.renderWeekly();
    } else {
      return this.renderCustom(gridElem);
    }
  }

  /**
   * Renders the daily mode grid for this habit.
   * @param gridElem - The grid element to populate.
   * @returns A container element with month blocks for daily tracking.
   */
  private renderDaily(gridElem: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    for (let m = 0; m < this.trackerConfig.months; m++) {
      const label = this.trackerConfig.hideMonthLabels ? null : getMonthLabel(m, this.trackerConfig);
      gridElem.innerHTML = '';
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
      container.appendChild(renderMonthBlock(label, gridElem.cloneNode(true) as HTMLElement));
    }
    return container;
  }

  /**
   * Renders the weekly mode grid for this habit.
   * @returns The monthsRow element with columns for each month.
   */
  private renderWeekly(): HTMLElement {
    const monthsRow = document.createElement('div');
    monthsRow.className = 'weekly-months-row';
    for (let m = 0; m < this.trackerConfig.months; m++) {
      const monthCol = document.createElement('div');
      monthCol.className = 'weekly-month-col';
      monthCol.style.display = 'flex';
      monthCol.style.flexDirection = 'column';
      monthCol.style.alignItems = 'center';
      monthCol.style.marginRight = '0.8em';
      // Month label
      if (!this.trackerConfig.hideMonthLabels) {
        const monthLabelElem = document.createElement('div');
        monthLabelElem.className = uiConfig.weekLabelClass;
        monthLabelElem.textContent = getMonthLabel(m, this.trackerConfig);
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
    return monthsRow;
  }

  /**
   * Renders the custom frequency mode grid for this habit.
   * @param gridElem - The grid element to populate.
   * @returns A container element with month blocks for custom tracking.
   */
  private renderCustom(gridElem: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    for (let m = 0; m < this.trackerConfig.months; m++) {
      const label = this.trackerConfig.hideMonthLabels ? null : getMonthLabel(m, this.trackerConfig);
      gridElem.innerHTML = '';
      const weeks = uiConfig.weeksInMonth;
      const days = this.habit.customDays.length || 1;
      gridElem.style.gridTemplateColumns = `repeat(${weeks * days}, ${uiConfig.cellSize})`;
      for (let w = 0; w < weeks; w++) {
        for (const d of this.habit.customDays) {
          const cellElem = document.createElement('span');
          cellElem.className = uiConfig.cellClass;
          cellElem.title = `Week ${w + 1} - ${DAYS_OF_WEEK[d]}`;
          cellElem.textContent = DAYS_OF_WEEK[d][0];
          gridElem.appendChild(cellElem);
        }
      }
      container.appendChild(renderMonthBlock(label, gridElem.cloneNode(true) as HTMLElement));
    }
    return container;
  }
}
