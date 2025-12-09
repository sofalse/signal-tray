import { jest } from "@jest/globals";

export const app = {
  whenReady: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
};

export const Tray = jest.fn();
export const Menu = {
  buildFromTemplate: jest.fn(),
};
export const BrowserWindow = jest.fn();
export const Notification = jest.fn();
export const ipcMain = {
  on: jest.fn(),
};
