import { describe, it, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

jest.unstable_mockModule("./settings.js", () => ({
  getSettings: jest.fn(),
  setLastChecked: jest.fn(),
  setLastSignal: jest.fn(),
  setLastBattery: jest.fn(),
}));

const axios = await import("axios");
const { modemRequest } = await import("./axios.js");
const settings = await import("./settings.js");

const mockedAxios = axios.default;

describe("modemRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a GET request with correct parameters and headers", async () => {
    const mockSettings = {
      modemIp: "192.168.1.1",
      authToken: "test-token-123",
      authCookie: "test-cookie-456",
    };

    const mockResponse = {
      status: 200,
      statusText: "OK",
      data: {
        signalbar: "4",
        battery_vol_percent: "85",
      },
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await modemRequest();

    expect(settings.getSettings).toHaveBeenCalledTimes(1);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(`http://${mockSettings.modemIp}/goform/goform_get_cmd_process`, {
      params: {
        multi_data: 1,
        isTest: false,
        cmd: "signalbar,battery_vol_percent",
        _: mockSettings.authToken,
      },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0",
        "X-Requested-With": "XMLHttpRequest",
        Referer: `http://${mockSettings.modemIp}/m/index.html`,
        Cookie: `stok=${mockSettings.authCookie}`,
      },
      timeout: 1000,
    });

    expect(settings.setLastChecked).toHaveBeenCalledTimes(1);
    expect(settings.setLastChecked).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/));

    expect(settings.setLastSignal).toHaveBeenCalledTimes(1);
    expect(settings.setLastSignal).toHaveBeenCalledWith(4);

    expect(settings.setLastBattery).toHaveBeenCalledTimes(1);
    expect(settings.setLastBattery).toHaveBeenCalledWith(85);

    expect(result).toEqual(mockResponse.data);
  });

  it("should return response data when status is 200", async () => {
    const mockSettings = {
      modemIp: "192.168.0.1",
      authToken: "token",
      authCookie: "cookie",
    };

    const mockResponse = {
      status: 200,
      statusText: "OK",
      data: {
        signalbar: "3",
        battery_vol_percent: "75",
      },
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await modemRequest();

    expect(result).toEqual({
      signalbar: "3",
      battery_vol_percent: "75",
    });
  });

  it("should correctly parse signalbar and battery_vol_percent values as integers", async () => {
    const mockSettings = {
      modemIp: "192.168.0.1",
      authToken: "token",
      authCookie: "cookie",
    };

    const mockResponse = {
      status: 200,
      statusText: "OK",
      data: {
        signalbar: "5",
        battery_vol_percent: "100",
      },
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockResolvedValue(mockResponse);

    await modemRequest();

    expect(settings.setLastSignal).toHaveBeenCalledWith(5);
    expect(settings.setLastBattery).toHaveBeenCalledWith(100);
  });

  it("should throw an error when status is not 200", async () => {
    const mockSettings = {
      modemIp: "192.168.0.1",
      authToken: "token",
      authCookie: "cookie",
    };

    const mockResponse = {
      status: 404,
      statusText: "Not Found",
      data: {},
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await modemRequest();

    expect(result).toEqual({
      error: {
        code: undefined,
        message: "Failed to fetch modem data: Not Found",
      },
    });
  });

  it("should return an error object when there is a network error", async () => {
    const mockSettings = {
      modemIp: "192.168.0.1",
      authToken: "token",
      authCookie: "cookie",
    };

    const networkError = {
      code: "ECONNREFUSED",
      message: "Connection refused",
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockRejectedValue(networkError);

    const result = await modemRequest();

    expect(result).toEqual({
      error: {
        code: "ECONNREFUSED",
        message: "Connection refused",
      },
    });

    expect(settings.setLastChecked).not.toHaveBeenCalled();
    expect(settings.setLastSignal).not.toHaveBeenCalled();
    expect(settings.setLastBattery).not.toHaveBeenCalled();
  });

  it("should return an error object when there is a timeout", async () => {
    const mockSettings = {
      modemIp: "192.168.0.1",
      authToken: "token",
      authCookie: "cookie",
    };

    const timeoutError = {
      code: "ECONNABORTED",
      message: "timeout of 1000ms exceeded",
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockRejectedValue(timeoutError);

    const result = await modemRequest();

    expect(result).toEqual({
      error: {
        code: "ECONNABORTED",
        message: "timeout of 1000ms exceeded",
      },
    });
  });

  it("should use values from getSettings to build URL and headers", async () => {
    const mockSettings = {
      modemIp: "10.0.0.1",
      authToken: "custom-token",
      authCookie: "custom-cookie",
    };

    const mockResponse = {
      status: 200,
      statusText: "OK",
      data: {
        signalbar: "2",
        battery_vol_percent: "50",
      },
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockResolvedValue(mockResponse);

    await modemRequest();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://10.0.0.1/goform/goform_get_cmd_process",
      expect.objectContaining({
        params: expect.objectContaining({
          _: "custom-token",
        }),
        headers: expect.objectContaining({
          Referer: "http://10.0.0.1/m/index.html",
          Cookie: "stok=custom-cookie",
        }),
      }),
    );
  });

  it("should correctly handle string values in the response", async () => {
    const mockSettings = {
      modemIp: "192.168.0.1",
      authToken: "token",
      authCookie: "cookie",
    };

    const mockResponse = {
      status: 200,
      statusText: "OK",
      data: {
        signalbar: "0",
        battery_vol_percent: "0",
      },
    };

    settings.getSettings.mockReturnValue(mockSettings);
    mockedAxios.get.mockResolvedValue(mockResponse);

    await modemRequest();

    expect(settings.setLastSignal).toHaveBeenCalledWith(0);
    expect(settings.setLastBattery).toHaveBeenCalledWith(0);
  });
});
