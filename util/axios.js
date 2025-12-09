import axios from "axios";
import { getSettings, setLastChecked, setLastSignal, setLastBattery } from "./settings.js";

export const modemRequest = async () => {
  const { modemIp, authToken, authCookie } = getSettings();
  const url = `http://${modemIp}/goform/goform_get_cmd_process`;
  try {
    const response = await axios.get(url, {
      params: {
        multi_data: 1,
        isTest: false,
        cmd: "signalbar,battery_vol_percent",
        _: authToken,
      },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0",
        "X-Requested-With": "XMLHttpRequest",
        Referer: `http://${modemIp}/m/index.html`,
        Cookie: `stok=${authCookie}`,
      },
      timeout: 1000,
    });
    setLastChecked(new Date().toISOString());
    setLastSignal(parseInt(response.data.signalbar, 10));
    setLastBattery(parseInt(response.data.battery_vol_percent, 10));
    if (response.status !== 200) {
      throw new Error(`Failed to fetch modem data: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    return { error: { code: error.code, message: error.message } };
  }
};
