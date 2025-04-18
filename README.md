# Atomic Habits Printable Tracker

Ultra-minimal, techy, single-page web app for generating and printing customizable A4 habit tracking templates inspired by Atomic Habits.

## Features
- Configure up to 3 habits with custom names, frequencies, and habit stacking prompts
- Track daily, weekly, or custom days per week
- Choose months to display (up to 12)
- Print-optimized A4 layout
- All vanilla TypeScript, CSS, and HTML (no dependencies)
- Monospace, ultra-minimal style

## Usage
1. Open `index.html` in your browser (after compiling TypeScript)
2. Click the ⚙️ Configure button to set up your tracker
3. Fill in habit details and apply
4. Print directly from your browser (Cmd+P / Ctrl+P)

## Development

### Compile TypeScript
```
tsc
```
This will generate `main.js` for browser use.

### File Structure
- `index.html` — Main HTML file
- `styles.css` — All CSS (reset, layout, print)
- `main.ts` — TypeScript app logic (compile to main.js)
- `tsconfig.json` — TypeScript config

---
No build tools or dependencies required. Just TypeScript, CSS, and HTML.
