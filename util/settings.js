import Store from "electron-store";

const schema = {
  modemIp: {
    type: "string",
    default: "192.168.0.1",
    format: "ipv4",
  },
  pingInterval: {
    type: "number",
    minimum: 1,
    maximum: 60 * 60 * 1000,
    default: 1000,
  },
  ping: {
    type: "boolean",
    default: true,
  },
  authToken: {
    type: "string",
    default: "",
  },
  authCookie: {
    type: "string",
    default: "",
  },
  notification: {
    type: "boolean",
    default: true,
  },
  lastChecked: {
    type: "string",
    default: "2025-12-09T15:58:18.316Z",
    format: "iso-date-time",
  },
  lastSignal: {
    type: "number",
    default: 0,
    minimum: 0,
    maximum: 5,
  },
  lastBattery: {
    type: "number",
    default: 0,
    minimum: 0,
    maximum: 100,
  },
  batteryNotification: {
    type: "boolean",
    default: true,
  },
  batteryNotificationTriggered: {
    type: "boolean",
    default: false,
  },
};

const store = new Store({ schema });

export const getModemIp = () => store.get("modemIp");
export const setModemIp = (ip) => store.set("modemIp", ip);
export const getPingInterval = () => store.get("pingInterval");
export const setPingInterval = (interval) => store.set("pingInterval", interval);
export const getPing = () => store.get("ping");
export const setPing = (ping) => store.set("ping", ping);
export const getAuthToken = () => store.get("authToken");
export const setAuthToken = (token) => store.set("authToken", token);
export const getAuthCookie = () => store.get("authCookie");
export const setAuthCookie = (cookie) => store.set("authCookie", cookie);
export const getNotification = () => store.get("notification");
export const setNotification = (notification) => store.set("notification", notification);
export const getLastChecked = () => store.get("lastChecked");
export const setLastChecked = (lastChecked) => store.set("lastChecked", lastChecked);
export const getLastSignal = () => store.get("lastSignal");
export const setLastSignal = (lastSignal) => store.set("lastSignal", lastSignal);
export const getLastBattery = () => store.get("lastBattery");
export const setLastBattery = (lastBattery) => store.set("lastBattery", lastBattery);
export const getBatteryNotification = () => store.get("batteryNotification");
export const setBatteryNotification = (batteryNotification) => store.set("batteryNotification", batteryNotification);
export const getBatteryNotificationTriggered = () => store.get("batteryNotificationTriggered");
export const setBatteryNotificationTriggered = (batteryNotificationTriggered) =>
  store.set("batteryNotificationTriggered", batteryNotificationTriggered);

export const getSettings = () => store.get();
