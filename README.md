# Atomic Habits Printable Tracker

WIP - Fired thi together with Windsurf, needs more love. 

<img width="1512" alt="Screenshot 2025-04-19 at 10 04 53" src="https://github.com/user-attachments/assets/a02d7661-c9ca-42c9-8042-dec3a2c7c4c3" />

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
