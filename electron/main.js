const { app, BrowserWindow, Tray, Menu, screen, session } = require("electron");
const path = require("path");

console.log("filename:", __filename);
console.log("directory name:", __dirname);

let mainWindow;
let tray;

// Remove default menu for performance and security
Menu.setApplicationMenu(null);

function createMainWindow() {
  const customWidth = 800;
  const customHeight = 600;

  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  mainWindow = new BrowserWindow({
    width: customWidth,
    height: customHeight,
    x: x + (width - customWidth) / 2,
    y: y + (height - customHeight) / 2,
    resizable: false,
    transparent: true,
    frame: false,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false, // SECURITY: do not expose Node.js in renderer
      enableRemoteModule: false,
      sandbox: process.env.NODE_ENV !== "development", // SECURITY: only enable sandbox in production
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

// NOTE: If you add IPC, always validate the sender and never trust input from renderer.
