# Carat Project Checklist

This file tracks the major tasks for the Carat Electron app project. Mark items as done or pending as work progresses.

---

## Priority Next Steps

### UI
- [ ] There will be a free and paid version of this application.
    - [ ] The default size of the overlay/window will be the smaller version (TBD on the exact size).
    - [ ] When a user has the paid version they unlock the full desktop size of the window/overlay.
- [ ] The CRUD controls should only be visible when hovered over.
- [ ] Figure out why the app icon is broken. Currently, when I start the app, the icon in the desktop toolbar is scaled up massively so that it is super wide and only parts of it are visible.
- [ ] Tags/category filters should only be included in the UI for the paid version of the app (so not on the smaller sized window version). Also, like I describe in the "Logic/Functionality" section of these notes, since they're optional on the paid version of the app, they should only appear for users when the feature is enabled.

### Logic/Functionality
- [ ] Remove the search functionality entirely. I'm not sure if that makes so much sense with some of the premise of this application
- [ ] Tags/category filters should be allowed, but optional and only for paid versions of the app
- [ ] Make it so that users should be able to show/hide the app window with a keyboard shortcut, as well as add a new gem via a keyboard shortcut.

### Cross-Platform Compatibility
- [ ] Test if this works on my linux machine.

---

## Project Setup & Structure
- [x] Review and refer to all provided rules and resources
- [x] Analyze the images for UI/UX inspiration
- [x] Audit and update dependencies for security and performance
- [x] Ensure Tailwind is set up and configured for the latest version
- [x] Ensure Electron is set up securely (context isolation, no remote code, etc.)
- [x] Set up a modern, bundled build process (Vite)

## UI/UX Implementation
- [x] Build the overlay window with a modern, dark, glassy look (main_inspo)
- [x] Implement the search bar and filter chips at the top
- [x] Design each "gem" (item) card to match the main_inspo style
- [x] Add CRUD controls to each gem, styled as in alt_inspo (edit, copy, delete)
- [x] Add "Add Gem" button at the bottom, styled as in main_inspo
- [x] Add settings/gear icon in the bottom right

## Functionality
- [x] Implement CRUD for gems (add, edit, delete, copy)
- [x] Store gems locally (using electron-store)
- [x] Ensure overlay window can be toggled from the system tray
- [x] Ensure all UI is responsive and accessible
- [ ] Implement search and filter by tag/category (**pending/optional**)
- [ ] Add support for tags/categories to gems (**pending/optional**)

## Performance & Security
- [x] Defer loading of heavy modules until needed
- [x] Avoid blocking main/renderer processes
- [x] Remove unnecessary polyfills and dependencies
- [x] Bundle code for performance
- [x] Set Menu.setApplicationMenu(null) if not using a menu
- [x] Follow all Electron security best practices (context isolation, nodeIntegration, sandbox, CSP, etc.)
- [x] Use sandbox: false in dev, true in production (for dev compatibility)

## Testing & Polish
- [x] Test on Mac (dev mode, CRUD, tray, window behavior)
- [ ] Test production build (`npm run build:ui` + `npm run build:electron`) (**pending**)
- [ ] Test on Windows and Linux (**optional**)
- [x] Review for accessibility and usability
- [ ] Profile for performance bottlenecks (**optional**)
- [ ] Package for distribution (electron-builder or electron-forge) (**optional**)

## Advanced/Optional Features
- [ ] Add tags/categories, search/filter logic
- [ ] Add import/export for gems
- [ ] Add settings/preferences functionality
- [ ] Improve dev workflow (electron-vite, vite-plugin-electron, etc.)

---

**Legend:**
- [x] Done
- [ ] Pending/To Do

---

_Last updated: May 2, 2025_ 