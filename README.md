# Mobile Browser Integration & Live Engine (MOBILE)

**Mobile Browser Integration & Live Engine (MOBILE)** — Mobile BDD test automation for UAT testing, using **Cucumber/Gherkin** for BDD and a **direct Appium client** (W3C WebDriver protocol) for driving tests on **Android** and **iOS** devices.

---

## Project Structure

```
mobile/
├── package.json
├── tsconfig.json
├── cucumber.js
├── src/
│   ├── appium/          AppiumClient — direct W3C WebDriver protocol client
│   ├── config/          ConfigReader — loads per-platform JSON config
│   └── driver/          DriverManager — creates Android/iOS Appium sessions
├── tests/
│   ├── pages/           Page objects (BasePage, JobsPage, LoginPage)
│   ├── steps/           Step definitions
│   ├── support/         Hooks, logger, world
│   └── config/          android.json, ios.json
└── features/            Gherkin .feature files
```

---

## Prerequisites

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| Node.js | 18+ | Runtime |
| pnpm | 9+ | Package manager |
| Appium | 2.x | Mobile automation server |
| Xcode | 15+ | iOS builds, simulators, and `xcrun` tools (macOS only) |
| Android Studio | Latest | Android SDK, emulators, and `adb` |

---

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Install Appium

```bash
# Install Appium 2 globally
npm install -g appium

# Install platform drivers
appium driver install uiautomator2   # Android
appium driver install xcuitest       # iOS

# Verify installation
appium driver list --installed
```

---

## 3. Connecting an Android Device

### Option A — Physical Device

1. **Enable Developer Options** on the device:
   - Go to **Settings > About phone** and tap **Build number** 7 times.

2. **Enable USB Debugging**:
   - Go to **Settings > Developer options** and turn on **USB debugging**.

3. **Connect via USB** and authorize the computer when prompted on the device.

4. **Verify the connection**:
   ```bash
   adb devices
   ```

5. **Update `tests/config/android.json`**:
   ```json
   {
     "device.name": "ABCDEF123456",
     "platform.version": "14",
     "app.path": "/absolute/path/to/your-app.apk"
   }
   ```

### Option B — Android Emulator

1. Open **Android Studio > Device Manager** and create an AVD (e.g. Pixel 7, API 34).

2. Start the emulator:
   ```bash
   emulator -avd Pixel_7_API_34
   ```

3. Verify:
   ```bash
   adb devices
   # emulator-5554  device
   ```

4. The default `android.json` already targets `emulator-5554`.

### Wireless ADB (optional)

```bash
adb tcpip 5555
adb connect <DEVICE_IP>:5555
```

---

## 4. Connecting an iOS Device

### Option A — Physical Device

1. **Connect the device via USB** to your Mac.

2. **Trust the computer** when prompted on the device.

3. **Find the device UDID**:
   ```bash
   xcrun xctrace list devices
   ```

4. **Set up code signing** — the app must be signed with a provisioning profile that includes your device's UDID.

5. **Install WebDriverAgent** on the device (Appium's XCUITest driver requires it):
   ```bash
   cd ~/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent
   open WebDriverAgent.xcodeproj
   ```

6. **Update `tests/config/ios.json`**:
   ```json
   {
     "device.name": "iPhone 14 Pro",
     "platform.version": "17.0",
     "device.udid": "00008110-XXXXXXXXXXXX",
     "app.path": "/absolute/path/to/your-app.ipa"
   }
   ```

### Option B — iOS Simulator

1. **List available simulators**:
   ```bash
   xcrun simctl list devices available
   ```

2. **Boot a simulator**:
   ```bash
   xcrun simctl boot "iPhone 15"
   open -a Simulator
   ```

3. The default `ios.json` targets `iPhone 15`.

---

## 5. Running Tests

### Start the Appium server

```bash
appium
```

### Run tests against Android

```bash
PLATFORM=android pnpm test
```

### Run tests against iOS

```bash
PLATFORM=ios pnpm test
```

### Run by tag

```bash
# Only @logout scenarios
PLATFORM=android pnpm test -- --tags "@logout"

# Exclude @ignore
PLATFORM=ios pnpm test -- --tags "not @ignore"
```

### Override config via environment variables

```bash
PLATFORM=android MOBILE_DEVICE_NAME=emulator-5556 pnpm test
```

---

## 6. Test Coverage

Feature files in `features/` and their corresponding UAT test cases:

| Feature File | Test Plan Reference | Description |
|---|---|---|
| `uat-landing-page.feature` | UAT-TC-01.0 | Homepage navigation to /jobs/ via hamburger menu |
| `uat-login-signup.feature` | UAT-TC-01.2 – TC-01.5 | Login form display, email validation, empty-field checks |
| `uat-verify-code.feature` | UAT-TC-02.1 – TC-02.2 | Verification code: invalid codes, existing-user login, new-user Create Account dialog |
| `uat-new-user.feature` | UAT-TC-03.1 | End-to-end new user signup: email, verify, fill form, authenticated |
| `jobs-header.feature` | — | Jobs page header element verification |

---

## 7. Writing Tests

### Add a Gherkin feature

Create a `.feature` file in `features/`:

```gherkin
Feature: Login
  Scenario: Successful login with valid credentials
    Given the "User" opens the url "https://stage.intelycare.com/jobs/"
    When the user taps the Login button
    And the user enters "test@example.com" in the login email field
    And the user clicks Continue
    Then the user should see the Verify Code screen
```

### Implement step definitions

Add a file in `tests/steps/`:

```typescript
import { When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/login-page.js';

const loginPage = new LoginPage();

When('I enter {string} as username', async function (username: string) {
  await loginPage.enterEmail(username);
});
```

### Add page objects

Extend `BasePage` in `tests/pages/` and use `waitForElement`, `tap`, `type`, etc.

---

## 8. Reports

After a test run, reports are generated in:

| Format | Path |
|--------|------|
| HTML | `reports/report.html` |
| JSON | `reports/report.json` |

---

## ChromeDriver Setup (Mobile Browser Testing)

When running tests against **Chrome on Android**, Appium needs a matching ChromeDriver for the version of Chrome installed on the device/emulator.

### Step 1 — Find the Chrome version on the device

```bash
adb shell pm dump com.android.chrome | grep versionName
# Example output: versionName=134.0.6998.x
```

### Step 2 — Install the matching ChromeDriver

```bash
npm install --prefix ~/.appium/node_modules/appium-uiautomator2-driver/node_modules/appium-chromedriver chromedriver@134
```

### Step 3 — Configure the path in `android.json`

```json
{
  "browser.name": "Chrome",
  "chromedriver.path": "/Users/<you>/.appium/node_modules/appium-uiautomator2-driver/node_modules/appium-chromedriver/node_modules/chromedriver/lib/chromedriver/chromedriver"
}
```

---

## IntelliJ IDE Setup

To run Cucumber tests directly from IntelliJ IDEA:

1. Open **Run > Edit Configurations...**
2. Select your **Cucumber.js** configuration
3. In the **Environment variables** field, add:
   ```
   NODE_OPTIONS=--import tsx
   ```
4. Apply and re-run

---

## Troubleshooting

Common troubleshooting tips have been moved to `docs/Troubleshooting.md`.

See: ./docs/Troubleshooting.md

---

## Tools

### Appium Inspector

A GUI tool for inspecting elements on your device/emulator — useful for finding locators.

**Install:**

```bash
brew install --cask appium-inspector
```

Or download from https://github.com/appium/appium-inspector/releases

**Setup:**

1. Set **Remote Host** to `127.0.0.1`, **Remote Port** to `4723`, and **Remote Path** to `/` (Appium 2+ does not use `/wd/hub`).
2. Paste the following capabilities to start a Chrome browser session:

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:platformVersion": "16",
  "browserName": "Chrome",
  "appium:chromedriverAutodownload": true,
  "appium:noReset": true
}
```

3. Make sure your Appium server is running and the emulator/device is connected, then click **Start Session**.

### Appium MCP

```bash
claude mcp add appium-mcp -- npx -y appium-mcp@latest
```

https://github.com/appium/appium-mcp
# AI_Prompts
