const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  screen,
  session,
  globalShortcut,
  ipcMain,
} = require("electron");
const path = require("path");

// --- VERSION FLAG ---
// Set this to true for paid version, false for free version
const isPaidVersion = true; // TODO: Replace with real license check in the future

console.log("filename:", __filename);
console.log("directory name:", __dirname);

let mainWindow;
let tray;

// Remove default menu for performance and security
Menu.setApplicationMenu(null);

function createMainWindow() {
  // Set window size based on version
  let customWidth, customHeight;
  if (isPaidVersion) {
    // Paid: full desktop size (or large window)
    const primaryDisplay = screen.getPrimaryDisplay();
    customWidth = Math.min(1200, primaryDisplay.workArea.width);
    customHeight = Math.min(800, primaryDisplay.workArea.height);
  } else {
    // Free: smaller overlay
    customWidth = 400;
    customHeight = 800;
  }

  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  process.env.CARAT_IS_PAID_VERSION = isPaidVersion ? "true" : "false";

  mainWindow = new BrowserWindow({
    width: customWidth,
    height: customHeight,
    x: x + (width - customWidth) / 2,
    y: y + (height - customHeight) / 2,
    resizable: isPaidVersion, // Only allow resizing in paid version
    transparent: true,
    frame: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: process.env.NODE_ENV !== "development",
      additionalArguments: [
        `isPaidVersion=${isPaidVersion}`, // Pass to renderer for UI logic
      ],
    },
  });

  const devUrl = "http://localhost:5174";
  const prodUrl = `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(process.env.NODE_ENV === "development" ? devUrl : prodUrl);

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
    console.log("preload path:", path.join(__dirname, "preload.js"));
  }
}

function createTray() {
  const iconPath = path.join(__dirname, "carat_diamond.png");
  tray = new Tray(iconPath);
  tray.setToolTip("Carat");
  tray.setIgnoreDoubleClickEvents(true);
  tray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      console.error("Main window is not defined");
    }
  });
}

function registerShortcuts() {
  // Show/hide window shortcut
  const toggleShortcut =
    process.platform === "darwin"
      ? "CommandOrControl+Shift+Space"
      : "Control+Shift+Space";
  globalShortcut.register(toggleShortcut, () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  // Add new gem shortcut
  globalShortcut.register("CommandOrControl+Option+N", () => {
    console.log("CommandOrControl+Option+N shortcut triggered");
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.webContents.send("focus-add-gem");
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      setTimeout(() => {
        mainWindow.webContents.send("focus-add-gem");
      }, 300); // Wait for window to be visible
    }
  });
}

app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");
app.commandLine.appendSwitch("use-gl", "swiftshader");

app.whenReady().then(async () => {
  if (process.env.NODE_ENV !== "development") {
    const csp = [
      "default-src 'self';",
      "script-src 'self';",
      "style-src 'self' 'unsafe-inline';",
      "img-src 'self' data:;",
      "font-src 'self';",
      "connect-src 'self';",
      "object-src 'none';",
      "base-uri 'self';",
      "form-action 'self';",
      "frame-ancestors 'none';",
    ].join(" ");
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [csp],
        },
      });
    });
  }

  console.log("App is ready");
  createMainWindow();
  createTray();
  registerShortcuts();

  screen.on("display-metrics-changed", () => {
    console.log(
      "Display metrics changed. Primary display:",
      screen.getPrimaryDisplay().bounds,
    );
    // Optionally reposition mainWindow here
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    console.log("Creating main window");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// NOTE: If you add IPC, always validate the sender and never trust input from renderer.
