import { app, BrowserWindow, Tray, Menu, screen } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'development') {
  import('electron-reload').then(module => {
    module.default(path.join(__dirname, '../'), {
      electron: path.join(__dirname, '../node_modules/.bin/electron'),
      hardResetMethod: 'exit',
    });
  });
}

let mainWindow;
let tray;

function createMainWindow() {
  const customWidth = 800;
  const customHeight = 600;

  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds;

  mainWindow = new BrowserWindow({
    width: customWidth, // Set to the size of your floating modal
    height: customHeight,
    x: x + (width - customWidth) / 2, // Center the window horizontally on primary display
    y: y + (height - customHeight) / 2, // Center the window vertically on primary display
    resizable: false, // Prevent resizing for a modal-like feel
    transparent: true, // Enable transparency
    frame: false, // Remove the default toolbar and frame
    alwaysOnTop: true, // Optional: Keep the window always on top
    skipTaskbar: true, // Optional: Don't show the app in the taskbar
    backgroundColor: '#00000000', // Set a transparent background color
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // mainWindow.setMenu(null);
  // mainWindow.center(); // Center the window
  // mainWindow.setBounds({ x: 100, y: 100, width: 400, height: 300 }); // Positing manually

  const devUrl = 'http://localhost:5174';
  const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(process.env.NODE_ENV === 'development' ? devUrl : prodUrl);


  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

function createTray() {
  const iconPath = path.join(__dirname, 'carat_diamond.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setToolTip('Carat');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createTray();

  screen.on('display-metrics-changed', () => {
    console.log('Display metrics changed. Primary display:', screen.getPrimaryDisplay().bounds);
    // Optionally reposition mainWindow here
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
