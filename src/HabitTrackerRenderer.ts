// Main class for rendering the tracker
import { TrackerConfig } from './types.js';
import { appRoot } from './dom.js';
import { uiConfig } from './config.js';
import { HabitSection } from './HabitSection.js';

/**
 * Main class for rendering the entire habit tracker application, including all habit sections.
 * Manages tracker configuration and delegates to HabitSection for each habit.
 */
export class HabitTrackerRenderer {
  /**
   * Creates a HabitTrackerRenderer instance.
   * @param trackerConfig - The initial tracker configuration to render.
   */
  constructor(private trackerConfig: TrackerConfig) {}

  /**
   * Renders the entire tracker UI, including title, subtitle, and all habit sections.
   */
  render(): void {
    appRoot.innerHTML = '';
    // Title
    const titleElement = document.createElement('h1');
    titleElement.textContent = uiConfig.appTitle;
    titleElement.style.fontSize = uiConfig.titleFontSize;
    titleElement.style.fontWeight = uiConfig.titleFontWeight;
    titleElement.style.letterSpacing = uiConfig.titleLetterSpacing;
    titleElement.style.marginBottom = uiConfig.titleMarginBottom;
    appRoot.appendChild(titleElement);
    // Subtitle
    const subtitleElement = document.createElement('div');
    subtitleElement.textContent = `Tracking for ${this.trackerConfig.months} month${this.trackerConfig.months > 1 ? 's' : ''}`;
    subtitleElement.style.fontSize = uiConfig.subtitleFontSize;
    subtitleElement.style.color = uiConfig.subtitleColor;
    subtitleElement.style.marginBottom = uiConfig.subtitleMarginBottom;
    appRoot.appendChild(subtitleElement);
    // Habit sections
    for (let i = 0; i < this.trackerConfig.habitCount; i++) {
      const habit = this.trackerConfig.habits[i];
      const section = new HabitSection(habit, this.trackerConfig);
      appRoot.appendChild(section.render());
    }
  }

  /**
   * Updates the tracker configuration and re-renders the tracker UI.
   * @param config - The new tracker configuration to use.
   */
  updateConfig(config: TrackerConfig) {
    this.trackerConfig = config;
    this.render();
  }
}
