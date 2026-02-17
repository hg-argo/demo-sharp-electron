import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import sharp from 'sharp';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/**
 * Will create an image with a blue circle on a white background
 */
ipcMain.handle('makeImage', async (event: IpcMainInvokeEvent) => {
  const width = 500;
  const height = 500;
  const circleRadius = 100;
  const circleColor = { r: 0, g: 0, b: 255, a: 255 }; // Blue
  const backgroundColor = { r: 255, g: 255, b: 255, a: 255 }; // White

  const outputPath = 'public/sharp-image.png';
  const buffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - width / 2;
      const dy = y - height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const offset = (y * width + x) * 4;

      // Pixels inside the circle
      if (distance <= circleRadius) {
        buffer[offset] = circleColor.r;
        buffer[offset + 1] = circleColor.g;
        buffer[offset + 2] = circleColor.b;
        buffer[offset + 3] = circleColor.a;
      }
      // Pixels outside the circle
      else {
        buffer[offset] = backgroundColor.r;
        buffer[offset + 1] = backgroundColor.g;
        buffer[offset + 2] = backgroundColor.b;
        buffer[offset + 3] = backgroundColor.a;
      }
    }
  }

  // Generate the image
  sharp(buffer, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath)
    .then(() => {
      console.log(`Image saved at ${outputPath}`);
    })
    .catch((err) => {
      console.error('Error creating image:', err);
    });
});