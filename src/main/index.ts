import { app, shell, BrowserWindow, globalShortcut } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { createIPCHandler } from "electron-trpc/main";
import { router } from "./trpc-main";
import { getId } from "./util/get-id";

let windows: { id: string; obj: BrowserWindow }[] = [];

const trpcHandler = createIPCHandler({
  router,
  windows: [],
});

function createWindow(id: string): void {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    x: windows.length ? width / (windows.length + 1) : 0,
    y: windows.length ? height / (windows.length + 1) : 0,
    show: false,
    title: id,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      devTools: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.setTitle(id);
    mainWindow.webContents.openDevTools();
  });

  mainWindow.webContents.executeJavaScript(`window.__id = "${id}"`);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    windows = windows.filter((w) => w.id !== id);
  });

  trpcHandler.attachWindow(mainWindow);

  windows.push({ id, obj: mainWindow });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  globalShortcut.register("CommandOrControl+Y", () => {
    for (const window of windows) {
      window.obj.close();
    }
  });

  createWindow(getId());
  createWindow(getId());
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  app.quit();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
