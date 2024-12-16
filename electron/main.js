const { app, BrowserWindow, Tray, Menu, screen } = require('electron')
const path = require('path')

console.log('filename:', __filename);
console.log('directory name:', __dirname);

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
    // alwaysOnTop: true, // Optional: Keep the window always on top
    // skipTaskbar: true, // Optional: Don't show the app in the taskbar
    backgroundColor: '#00000000', // Set a transparent background color
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });
  // mainWindow.setMenu(null);
  // mainWindow.center(); // Center the window
  // mainWindow.setBounds({ x: 100, y: 100, width: 400, height: 300 }); // Positing manually

  const devUrl = 'http://localhost:5174';
  const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(process.env.NODE_ENV === 'development' ? devUrl : prodUrl);


  // if (process.env.NODE_ENV === 'development') {
  //   mainWindow.webContents.openDevTools();
  //   console.log('preload path:', path.join(__dirname, 'preload.js'));
  // }
}

function createTray() {
  const iconPath = path.join(__dirname, 'carat_diamond.png');
  tray = new Tray(iconPath);

  tray.setToolTip('Carat');

  tray.setIgnoreDoubleClickEvents(true);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        console.log('Hiding window');
        mainWindow.hide();
      } else {
        console.log('Showing window');
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      console.error('Main window is not defined');
    }
  });
}

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('use-gl', 'swiftshader');

app.whenReady().then(() => {
  console.log('App is ready');
  createMainWindow();
  createTray();

  screen.on('display-metrics-changed', () => {
    console.log('Display metrics changed. Primary display:', screen.getPrimaryDisplay().bounds);
    // Optionally reposition mainWindow here
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    console.log('Creating main window');
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})
