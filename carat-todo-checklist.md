# Carat Project Checklist

This file tracks the major tasks for the Carat Electron app project. Mark items as done or pending as work progresses.

---

## Priority Next Steps

### UI
- [x] There will be a free and paid version of this application.
    - [x] The default size of the overlay/window will be the smaller version (TBD on the exact size).
    - [x] When a user has the paid version they unlock the full desktop size of the window/overlay.
- [x] The CRUD controls should only be visible when hovered over.
- [x] Figure out why the app icon is broken. Currently, when I start the app, the icon in the desktop toolbar is scaled up massively so that it is super wide and only parts of it are visible.
- [x] Tags/category filters should only be included in the UI for the paid version of the app (so not on the smaller sized window version). Also, like I describe in the "Logic/Functionality" section of these notes, since they're optional on the paid version of the app, they should only appear for users when the feature is enabled.

- [ ] The add gem input UI has to have more expandable options, like for example:
    - [ ] If a user wants to add a link (title or text, the actual url, etc.)
    - [ ] If the user wants to add a title to the gem
    - [ ] Other?
- [ ] The CRUD buttons should sit inside of a vertical ellipsis menu (three dot menu)
    - [ ] They should be stacked inside of the dropdown ellipsis menu
- [ ] Remove borders when hovering over gems (items)
- [ ] Sizing, and amount of gems allowed in free version:
    - [ ] The free version has the smaller, non-resizable, fixed size window, and the number of gems (items) allowed are the max number that fit in the window without overflowing.
    - [ ] The free/smaller version should not be allowed to scroll overflowing content.
    - [ ] The paid version has the bigger sized, resizable application window. The paid version correctly allows resizing, but when a user resizes the window I don't want window to display scrollbars--they should definitely be allowed to scroll horizontally or vertically, but don't show the scrollbars in the UI.
    - [ ] Note: I want the gems (items) themselves to allow for scrolling/overflow content (in both versions) in the case where a user enters in a long string of content (in this case, allow for the overflow to scroll, but still keep scrollbars from displaying on overflowing gem content).
    - [ ] For the paid version, set the max-width of the window to the screen.
- [ ] UI/UX updates to adding a gem:
    - [ ] When on the smaller sized version, the input for adding a gem does not fit in the window, it currently overflows and gets partially cut off.
    - [ ] On both versions, after entering the keyboard shortcut to show the add gem input or clicking the plus icon to show the input, the plus icon should become disabled (not clickable and look grayed out).

### Logic/Functionality
- [x] Remove the search functionality entirely. I'm not sure if that makes so much sense with some of the premise of this application
- [x] Tags/category filters should be allowed, but optional and only for paid versions of the app
- [x] Completely replace the tags/category filters feature with a simple favorites feature.
    - The favorites feature should also be optional for paid users/versions of the app like the tags/category filters feature, so it should also be enabled/disabled by a toggle in the settings modal. Free users/paid version of the app should not see the toggle.
    - When enabled, the favorites feature should only ever take up one column in the application window (that column being the first column on the left). The favorites feature should never be more than one column on any size no matter what.
- [x] Make it so that users should be able to show/hide the app window with a keyboard shortcut, as well as add a new gem via a keyboard shortcut.

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
- [ ] Add import/export for gems
- [ ] Add settings/preferences functionality
- [ ] Improve dev workflow (electron-vite, vite-plugin-electron, etc.)
- [x] Show the 'add gem' input and focus it when the add gem keyboard shortcut is executed. If the input is hidden before the shortcut, it should become visible and focused.
- [x] Add an 'Add Gem' button next to the input that calls handleAdd() on click (in addition to Enter key).
- [x] The add gem keyboard shortcut should toggle the visibility of the add gem input, just like the plus icon toggles it.
- [x] Both the plus icon to add a gem and the add gem keyboard shortcut should clear the state of the add gem input when the input is being hidden so that every time the add gem input becomes visible its clear from any previous state.
- [x] When the add gem input is visible and focused on, if the escape key is pressed, it should clear the input and hide it.

---

**Legend:**
- [x] Done
- [ ] Pending/To Do

---

_Last updated: May 16, 2025_
