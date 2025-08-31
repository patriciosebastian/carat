# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

Carat is a cross-platform desktop overlay application built with Electron and React (non-TypeScript) that allows users to quickly store and access small but frequently needed resources like commands, snippets, and reference information. It's designed to be accessed via a desktop toolbar icon and emphasizes quick, on-demand access without opening files or web browsers.

The application features:
- Desktop overlay window that shows/hides from toolbar icon
- CRUD operations on items called "gems"
- Grid-based layout with responsive columns
- Favorites feature (paid version)
- Global keyboard shortcuts for quick access
- Persistent data storage using electron-store

## Development Commands

**Development server:**
```bash
npm run dev
```
- Starts Vite dev server on port 5174
- Enables hot reloading for React components

**Build UI:**
```bash
npm run build:ui
```
- Builds React frontend to `dist/` directory

**Start Electron (development):**
```bash
npm start
```
- Runs Electron with live reload using nodemon
- Opens DevTools automatically

**Build Electron (production):**
```bash
npm run build:electron
```
- Runs Electron in production mode

**Format code:**
```bash
npx prettier --write .
```
- Uses Prettier with Tailwind CSS plugin for formatting

## Architecture

### Main Process (`electron/main.js`)
- Creates BrowserWindow with transparent, frameless design
- Manages system tray with click-to-toggle functionality
- Registers global shortcuts:
  - `Cmd+Shift+Space` (Mac) / `Ctrl+Shift+Space` (Windows/Linux): Show/hide window
  - `Cmd+Option+N`: Focus add gem input
- Implements paid/free version logic with different window sizes
- Applies Content Security Policy in production
- Manages window positioning and display metrics

### Renderer Process (`src/App.jsx`)
- Single-page React application managing all UI state
- Uses `window.api` bridge (from preload script) for IPC
- Handles CRUD operations for gems
- Implements favorites system for paid version
- Responsive grid layout (1-6 columns based on screen size)
- Keyboard shortcuts and accessibility support

### Data Storage (`electron/store.js`)
- Uses electron-store for persistent data
- Simple schema with array of gem items
- Automatic JSON serialization/deserialization

### Build System
- Vite for frontend bundling with React plugin
- Custom port 5174 for development
- Source files in `src/`, output to `dist/`
- Tailwind CSS with PostCSS for styling

## Key Implementation Notes

**Version Management:**
- `isPaidVersion` flag in `electron/main.js` controls feature access
- Paid version: larger resizable window, favorites feature
- Free version: smaller fixed window, basic functionality

**IPC Communication:**
- Preload script exposes safe API methods via `window.api`
- Main process sends `focus-add-gem` events for keyboard shortcuts
- All data operations routed through secure IPC channels

**UI Patterns:**
- Grid-based responsive layout using Tailwind CSS classes
- Hover states reveal action buttons (edit, copy, delete, favorite)
- Modal dialogs with escape key handling
- Toast notifications for user feedback
- Keyboard navigation support

**Security:**
- Context isolation enabled
- Node integration disabled in renderer
- Sandbox mode in production
- CSP headers applied in production
- Input validation for all user data

## Development Workflow

1. Start development server: `npm run dev`
2. In separate terminal, start Electron: `npm start`
3. Make changes to React components in `src/`
4. Changes auto-reload via Vite HMR
5. Electron changes require restart of `npm start`

For production builds:
1. Build UI: `npm run build:ui`
2. Build Electron: `npm run build:electron`

## Important Files

- `src/App.jsx`: Main React component with all UI logic
- `electron/main.js`: Main Electron process with window management
- `electron/preload.js`: IPC bridge between main and renderer
- `electron/store.js`: Data persistence layer
- `vite.config.js`: Frontend build configuration
- `tailwind.config.js`: Utility-first CSS configuration