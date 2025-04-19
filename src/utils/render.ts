/**
 * Utility for reusable DOM rendering, including month block (label + grid) creation.
 */

/**
 * Renders a month block row containing a label and a grid.
 * @param label - The label text, or null to omit label
 * @param grid - The grid element to include
 * @param labelClass - The CSS class for the label element
 * @returns The composed row element
 */
export function renderMonthBlock(label: string|null, grid: HTMLElement, labelClass: string = 'tracker-week-month-label'): HTMLElement {
  const row = document.createElement('div');
  row.className = 'month-flex-row';
  if (label) {
    const labelElem = document.createElement('div');
    labelElem.className = labelClass;
    labelElem.textContent = label;
    row.appendChild(labelElem);
  }
  row.appendChild(grid);
  return row;
}
