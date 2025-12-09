import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const mockStore = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.unstable_mockModule("electron-store", () => ({
  default: jest.fn(() => mockStore),
}));

const {
  getModemIp,
  setModemIp,
  getPingInterval,
  setPingInterval,
  getPing,
  setPing,
  getAuthToken,
  setAuthToken,
  getAuthCookie,
  setAuthCookie,
  getNotification,
  setNotification,
  getLastChecked,
  setLastChecked,
  getLastSignal,
  setLastSignal,
  getLastBattery,
  setLastBattery,
  getBatteryNotification,
  setBatteryNotification,
  getBatteryNotificationTriggered,
  setBatteryNotificationTriggered,
  getSettings,
} = await import("./settings.js");

describe("settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("modemIp", () => {
    it("should get modemIp from store", () => {
      const expectedIp = "192.168.1.1";
      mockStore.get.mockReturnValue(expectedIp);

      const result = getModemIp();

      expect(mockStore.get).toHaveBeenCalledWith("modemIp");
      expect(result).toBe(expectedIp);
    });

    it("should set modemIp in store", () => {
      const ip = "10.0.0.1";
      setModemIp(ip);

      expect(mockStore.set).toHaveBeenCalledWith("modemIp", ip);
    });
  });

  describe("pingInterval", () => {
    it("should get pingInterval from store", () => {
      const expectedInterval = 5000;
      mockStore.get.mockReturnValue(expectedInterval);

      const result = getPingInterval();

      expect(mockStore.get).toHaveBeenCalledWith("pingInterval");
      expect(result).toBe(expectedInterval);
    });

    it("should set pingInterval in store", () => {
      const interval = 2000;
      setPingInterval(interval);

      expect(mockStore.set).toHaveBeenCalledWith("pingInterval", interval);
    });
  });

  describe("ping", () => {
    it("should get ping from store", () => {
      const expectedPing = true;
      mockStore.get.mockReturnValue(expectedPing);

      const result = getPing();

      expect(mockStore.get).toHaveBeenCalledWith("ping");
      expect(result).toBe(expectedPing);
    });

    it("should set ping in store", () => {
      const ping = false;
      setPing(ping);

      expect(mockStore.set).toHaveBeenCalledWith("ping", ping);
    });
  });

  describe("authToken", () => {
    it("should get authToken from store", () => {
      const expectedToken = "test-token-123";
      mockStore.get.mockReturnValue(expectedToken);

      const result = getAuthToken();

      expect(mockStore.get).toHaveBeenCalledWith("authToken");
      expect(result).toBe(expectedToken);
    });

    it("should set authToken in store", () => {
      const token = "new-token-456";
      setAuthToken(token);

      expect(mockStore.set).toHaveBeenCalledWith("authToken", token);
    });
  });

  describe("authCookie", () => {
    it("should get authCookie from store", () => {
      const expectedCookie = "test-cookie-123";
      mockStore.get.mockReturnValue(expectedCookie);

      const result = getAuthCookie();

      expect(mockStore.get).toHaveBeenCalledWith("authCookie");
      expect(result).toBe(expectedCookie);
    });

    it("should set authCookie in store", () => {
      const cookie = "new-cookie-456";
      setAuthCookie(cookie);

      expect(mockStore.set).toHaveBeenCalledWith("authCookie", cookie);
    });
  });

  describe("notification", () => {
    it("should get notification from store", () => {
      const expectedNotification = true;
      mockStore.get.mockReturnValue(expectedNotification);

      const result = getNotification();

      expect(mockStore.get).toHaveBeenCalledWith("notification");
      expect(result).toBe(expectedNotification);
    });

    it("should set notification in store", () => {
      const notification = false;
      setNotification(notification);

      expect(mockStore.set).toHaveBeenCalledWith("notification", notification);
    });
  });

  describe("lastChecked", () => {
    it("should get lastChecked from store", () => {
      const expectedDate = "2025-12-09T15:58:18.316Z";
      mockStore.get.mockReturnValue(expectedDate);

      const result = getLastChecked();

      expect(mockStore.get).toHaveBeenCalledWith("lastChecked");
      expect(result).toBe(expectedDate);
    });

    it("should set lastChecked in store", () => {
      const date = "2025-12-10T10:30:00.000Z";
      setLastChecked(date);

      expect(mockStore.set).toHaveBeenCalledWith("lastChecked", date);
    });
  });

  describe("lastSignal", () => {
    it("should get lastSignal from store", () => {
      const expectedSignal = 4;
      mockStore.get.mockReturnValue(expectedSignal);

      const result = getLastSignal();

      expect(mockStore.get).toHaveBeenCalledWith("lastSignal");
      expect(result).toBe(expectedSignal);
    });

    it("should set lastSignal in store", () => {
      const signal = 3;
      setLastSignal(signal);

      expect(mockStore.set).toHaveBeenCalledWith("lastSignal", signal);
    });
  });

  describe("lastBattery", () => {
    it("should get lastBattery from store", () => {
      const expectedBattery = 85;
      mockStore.get.mockReturnValue(expectedBattery);

      const result = getLastBattery();

      expect(mockStore.get).toHaveBeenCalledWith("lastBattery");
      expect(result).toBe(expectedBattery);
    });

    it("should set lastBattery in store", () => {
      const battery = 75;
      setLastBattery(battery);

      expect(mockStore.set).toHaveBeenCalledWith("lastBattery", battery);
    });
  });

  describe("batteryNotification", () => {
    it("should get batteryNotification from store", () => {
      const expectedBatteryNotification = true;
      mockStore.get.mockReturnValue(expectedBatteryNotification);

      const result = getBatteryNotification();

      expect(mockStore.get).toHaveBeenCalledWith("batteryNotification");
      expect(result).toBe(expectedBatteryNotification);
    });

    it("should set batteryNotification in store", () => {
      const batteryNotification = false;
      setBatteryNotification(batteryNotification);

      expect(mockStore.set).toHaveBeenCalledWith("batteryNotification", batteryNotification);
    });
  });

  describe("batteryNotificationTriggered", () => {
    it("should get batteryNotificationTriggered from store", () => {
      const expectedBatteryNotificationTriggered = true;
      mockStore.get.mockReturnValue(expectedBatteryNotificationTriggered);

      const result = getBatteryNotificationTriggered();

      expect(mockStore.get).toHaveBeenCalledWith("batteryNotificationTriggered");
      expect(result).toBe(expectedBatteryNotificationTriggered);
    });

    it("should set batteryNotificationTriggered in store", () => {
      const batteryNotificationTriggered = true;
      setBatteryNotificationTriggered(batteryNotificationTriggered);

      expect(mockStore.set).toHaveBeenCalledWith("batteryNotificationTriggered", batteryNotificationTriggered);
    });
  });

  describe("getSettings", () => {
    it("should get all settings from store", () => {
      const expectedSettings = {
        modemIp: "192.168.0.1",
        pingInterval: 1000,
        ping: true,
        authToken: "token",
        authCookie: "cookie",
        notification: true,
        lastChecked: "2025-12-09T15:58:18.316Z",
        lastSignal: 4,
        lastBattery: 85,
        batteryNotification: true,
        batteryNotificationTriggered: false,
      };
      mockStore.get.mockReturnValue(expectedSettings);

      const result = getSettings();

      expect(mockStore.get).toHaveBeenCalledWith();
      expect(result).toEqual(expectedSettings);
    });

    it("should return empty object when store is empty", () => {
      mockStore.get.mockReturnValue({});

      const result = getSettings();

      expect(mockStore.get).toHaveBeenCalledWith();
      expect(result).toEqual({});
    });
  });
});
