# Changes

## 2026-02-27 — Initial Mobile setup

### Summary
Ported the desktop UAT test framework to a mobile-first project using Appium for Android (Chrome) and iOS (Safari) testing. The project provides a small TypeScript-based test framework (Cucumber + custom Appium client) and a set of example page objects, step definitions, and platform configs to run UAT scenarios against Android emulators and iOS simulators.

### Notable changes
- `src/appium/` — lightweight W3C WebDriver client (AppiumClient, AppiumElement).
- `src/appium/types.ts` — locator helpers and capability interfaces.
- `src/config/config-reader.ts` — per-platform JSON config loader (`tests/config/*.json`).
- `src/driver/driver-manager.ts` — singleton driver lifecycle and capability builders for Android/iOS.
- `tests/pages/`, `tests/steps/`, `tests/support/` — initial page objects, step definitions, and Cucumber hooks.
- `features/` — sample Gherkin feature files for UAT scenarios.

For full setup and runtime instructions (Appium 2 driver installation, emulator/simulator setup, running tests), see `README.md`.
