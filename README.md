# Signal tray

[![codecov](https://codecov.io/github/sofalse/signal-tray/graph/badge.svg?token=K9ZT2X6DGT)](https://codecov.io/github/sofalse/signal-tray)
[![CodeFactor](https://www.codefactor.io/repository/github/sofalse/signal-tray/badge)](https://www.codefactor.io/repository/github/sofalse/signal-tray)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a simple macOS tray application to track the signal strength of a `goform` compatible LTE/5G modem.

You'll need:

- Your modem IP (usually `192.168.0.1`)
- Auth token — taken from `_` query param from requests to the router's API (check network tab on the router admin page)
- Auth cookie — token from `stok` cookie (similar as the one above, copy only the cookie value)

AFAIK this should validate forever.
I've done this as a personal tool, not really planning any active maintenance (unless it'll break for me too).

Tested and working on **ZTE U50**.
