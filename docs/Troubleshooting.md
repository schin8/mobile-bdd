# Troubleshooting

This document contains common troubleshooting tips for running the mobile test suite (Appium, emulators/simulators, device connections and Chromedriver).

## Table of contents

- [Emulator & ADB issues](#emulator--adb-issues)
- [iOS issues](#ios-issues)
- [Session & configuration errors](#session--configuration-errors)
- [ChromeDriver / mobile Chrome](#chromedriver--mobile-chrome)
- [Further help](#further-help)

---

## Emulator & ADB issues

- Emulator can't reach `localhost`
  - Solution: The emulator's `localhost` is itself, not your Mac. Use `10.0.2.2` instead (e.g. `http://10.0.2.2:4173/`). Verify with `adb shell curl http://10.0.2.2:<port>`.

- `adb devices` shows "unauthorized"
  - Solution: Tap **Allow** on the USB debugging prompt on the device.

- Emulator not detected by `adb`
  - Solution: Run `adb kill-server && adb start-server`.

---

## iOS issues

- iOS real device — WebDriverAgent fails to install
  - Solution: Open `WebDriverAgent.xcodeproj`, set your signing team, and build manually.

- iOS simulator — app won't install
  - Solution: Make sure you're using a `.app` bundle, not a `.ipa`.

---

## Session & configuration errors

- `Could not create session`
  - Solution: Verify Appium is running (`appium`) and the config (capabilities) matches your device/emulator.

- Wrong platform version error
  - Solution: Check `platform.version` in your config file matches the device/emulator.

---

## ChromeDriver / mobile Chrome

- `No Chromedriver found that can automate Chrome 'X'`

  Appium requires explicit opt-in to download chromedriver at runtime because it is treated as an insecure operation (outbound network request + binary execution).

  **Option 1 — `.appiumrc.json` (recommended, already configured)**

  The project root contains `.appiumrc.json` which enables the feature automatically every time you run `appium`:

  ```json
  {
    "server": {
      "allow-insecure": ["uiautomator2:chromedriver_autodownload"]
    }
  }
  ```

  Simply run `appium` from the project root and the setting is picked up automatically.

  **Option 2 — CLI flag (one-off)**

  ```bash
  appium --allow-insecure=uiautomator2:chromedriver_autodownload
  ```

  The download only happens once per new Chrome version; subsequent runs reuse the cached chromedriver.

  If you need to install a specific chromedriver manually, follow the instructions in the README under "ChromeDriver Setup (Mobile Browser Testing)".

---

## Further help

If the tips above don't resolve your issue, collect the Appium server logs and the output from `adb devices` / `xcrun simctl list devices` and open an issue with that information.

For full setup and driver installation instructions, see `README.md`.
