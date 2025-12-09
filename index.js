import { exit } from "process";
import { app, Tray, Menu, BrowserWindow, Notification, ipcMain } from "electron/main";
import { nativeImage } from "electron/common";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import {
  getSettings,
  setPing,
  setPingInterval,
  setModemIp,
  setAuthToken,
  setAuthCookie,
  setNotification,
} from "./settings.js";
import { modemRequest } from "./util/axios.js";
dayjs.extend(customParseFormat);

let tray = null;
let settings;
let mainLoopInterval = null;

let settingsWindow = null;

const noReception = nativeImage.createFromPath("assets/icons/none.png");
const oneBarIcon = nativeImage.createFromPath("assets/icons/1bar.png");
const twoBarIcon = nativeImage.createFromPath("assets/icons/2bar.png");
const threeBarIcon = nativeImage.createFromPath("assets/icons/3bar.png");
const fourBarIcon = nativeImage.createFromPath("assets/icons/4bar.png");
const disabledIcon = nativeImage.createFromPath("assets/icons/disabled.png");

const iconMap = {
  0: noReception,
  1: oneBarIcon,
  2: twoBarIcon,
  3: threeBarIcon,
  4: fourBarIcon,
  5: fourBarIcon,
};

function createWindow() {
  if (settingsWindow !== null) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "Settings",
  });

  settingsWindow.loadFile("frontend/index.html");

  // Instead of quitting app on close, just hide the window and dereference
  settingsWindow.on("close", (e) => {
    if (settingsWindow !== null && settingsWindow.isVisible()) {
      e.preventDefault();
      settingsWindow.hide();
    }
  });

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

function setupIpcHandlers() {
  // Handle load-settings request from renderer
  ipcMain.on("load-settings", (event) => {
    const currentSettings = getSettings();
    event.reply("settings-loaded", currentSettings);
  });

  // Handle save-settings from renderer
  ipcMain.on("save-settings", (event, settingsData) => {
    try {
      if (settingsData.modemIp) {
        setModemIp(settingsData.modemIp);
      }
      if (settingsData.authToken !== undefined) {
        setAuthToken(settingsData.authToken);
      }
      if (settingsData.authCookie !== undefined) {
        setAuthCookie(settingsData.authCookie);
      }
      // Refresh settings and restart main loop
      settings = getSettings();
      startMainLoop();
      // Send confirmation back to renderer
      event.reply("settings-saved", { success: true });
    } catch (error) {
      event.reply("settings-saved", { success: false, error: error.message });
    }
  });
}

function showSettingsWindow() {
  if (settingsWindow !== null) {
    settingsWindow.show();
  }
}

function startMainLoop() {
  // Clear existing interval if it exists
  if (mainLoopInterval !== null) {
    clearInterval(mainLoopInterval);
    mainLoopInterval = null;
  }

  // Refresh settings to get latest values
  settings = getSettings();

  // Only start interval if ping is enabled
  if (settings.ping) {
    mainLoopInterval = setInterval(async () => {
      const modemData = await modemRequest();
      if (modemData) {
        if (modemData.error && settings.notification) {
          new Notification({
            title: "Error fetching modem data",
            body: modemData.error.message,
          }).show();
          return;
        }
        tray.setImage(iconMap[parseInt(modemData.signalbar, 10)]);
        tray.setToolTip(`Signal: ${modemData.signalbar}%, Battery: ${modemData.battery_vol_percent}%`);
        if (
          settings.batteryNotification &&
          modemData.battery_vol_percent < 20 &&
          !settings.batteryNotificationTriggered
        ) {
          new Notification({
            title: "Battery low",
            body: `Battery is at ${modemData.battery_vol_percent}%, please charge your device`,
          }).show();
          setBatteryNotificationTriggered(true);
        }
        if (
          settings.batteryNotification &&
          modemData.battery_vol_percent > 30 &&
          settings.batteryNotificationTriggered
        ) {
          setBatteryNotificationTriggered(false);
        }
      }
    }, settings.pingInterval);
  }
}

app.whenReady().then(() => {
  // Set up IPC handlers once
  setupIpcHandlers();

  createWindow();

  settings = getSettings();
  tray = new Tray(settings.ping ? iconMap[0] : disabledIcon);
  tray.setToolTip("Signal Tray");

  function buildContextMenu() {
    // Refresh settings on every menu build
    settings = getSettings();

    return Menu.buildFromTemplate([
      {
        label: "Ping modem",
        type: "checkbox",
        checked: settings.ping,
        click: () => {
          const newPingValue = !settings.ping;
          setPing(newPingValue);
          tray.setImage(newPingValue ? iconMap[0] : disabledIcon);
          // Rebuild menu after setting change
          tray.setContextMenu(buildContextMenu());
          // Restart main loop when ping changes
          startMainLoop();
        },
      },
      {
        label: "Show notifications",
        type: "checkbox",
        checked: settings.notification,
        click: () => {
          setNotification(!settings.notification);
          tray.setContextMenu(buildContextMenu());
        },
      },
      {
        label: "Show battery notifications",
        type: "checkbox",
        checked: settings.batteryNotification,
        click: () => {
          setBatteryNotification(!settings.batteryNotification);
          tray.setContextMenu(buildContextMenu());
        },
      },
      {
        label: "Ping interval",
        type: "submenu",
        submenu: [
          {
            label: "1 second",
            type: "radio",
            checked: settings.pingInterval === 1000,
            click: () => {
              setPingInterval(1000);
              // Rebuild menu after setting change
              tray.setContextMenu(buildContextMenu());
              // Restart main loop when interval changes
              startMainLoop();
            },
          },
          {
            label: "5 seconds",
            type: "radio",
            checked: settings.pingInterval === 5000,
            click: () => {
              setPingInterval(5000);
              // Rebuild menu after setting change
              tray.setContextMenu(buildContextMenu());
              // Restart main loop when interval changes
              startMainLoop();
            },
          },
          {
            label: "30 seconds",
            type: "radio",
            checked: settings.pingInterval === 30000,
            click: () => {
              setPingInterval(30000);
              // Rebuild menu after setting change
              tray.setContextMenu(buildContextMenu());
              // Restart main loop when interval changes
              startMainLoop();
            },
          },
          {
            label: "1 minute",
            type: "radio",
            checked: settings.pingInterval === 60000,
            click: () => {
              setPingInterval(60000);
              // Rebuild menu after setting change
              tray.setContextMenu(buildContextMenu());
              // Restart main loop when interval changes
              startMainLoop();
            },
          },
        ],
      },
      {
        type: "separator",
      },
      {
        type: "normal",
        label: `Signal: ${settings.lastSignal}/5, Battery: ${settings.lastBattery}%`,
        click: () => {},
      },
      {
        type: "normal",
        label: `Last checked: ${dayjs(settings.lastChecked).format("HH:mm:ss, MMM D")}`,
        click: () => {},
      },
      {
        label: "Show settings",
        type: "normal",
        click: () => {
          showSettingsWindow();
        },
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        click: () => {
          clearInterval(mainLoopInterval);
          app.quit();
          exit(0);
        },
      },
    ]);
  }

  // Set initial context menu
  tray.setContextMenu(buildContextMenu());

  tray.on("click", () => {
    // Rebuild menu with fresh settings before showing
    tray.setContextMenu(buildContextMenu());
  });

  // Start the main loop automatically after app start
  startMainLoop();
});

app.on("window-all-closed", () => {
  if (tray !== null) {
    tray.destroy();
  }
  tray = null;
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
