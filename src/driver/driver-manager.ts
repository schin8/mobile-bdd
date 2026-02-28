import { AppiumClient } from '../appium/client.js';
import { ConfigReader } from '../config/config-reader.js';
import { logger } from '../../tests/support/logger.js';
import type { AppiumCapabilities } from '../appium/types.js';

/**
 * Manages the Appium driver lifecycle.
 * Mirrors MOBILE's DriverManager — one driver at a time.
 */
let currentDriver: AppiumClient | null = null;

export function getDriver(): AppiumClient {
  if (!currentDriver) throw new Error('Driver not initialized — call initDriver() first');
  return currentDriver;
}

export async function initDriver(platform: string): Promise<void> {
  if (currentDriver) {
    logger.debug('Driver already active — reusing existing session');
    return;
  }

  const platformName = platform.toUpperCase();
  const config = new ConfigReader(platform);
  const serverUrl = config.get('appium.server.url', 'http://127.0.0.1:4723')!;

  logger.info(`Initializing ${platformName} driver against Appium server: ${serverUrl}`);

  const client = new AppiumClient(serverUrl);
  let capabilities: AppiumCapabilities;

  switch (platformName) {
    case 'ANDROID':
      capabilities = buildAndroidCapabilities(config);
      break;
    case 'IOS':
      capabilities = buildIOSCapabilities(config);
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  await client.createSession(capabilities);

  const implicitWait = parseInt(config.get('implicit.wait.seconds', '10')!, 10);
  await client.setImplicitWait(implicitWait * 1000);

  currentDriver = client;
  logger.debug(`${platformName} driver initialized successfully`);
}

export async function quitDriver(): Promise<void> {
  if (currentDriver) {
    logger.debug('Quitting Appium driver');
    await currentDriver.deleteSession();
    currentDriver = null;
  }
}

// ── Capability builders ──────────────────────────────────────────────

function buildAndroidCapabilities(config: ConfigReader): AppiumCapabilities {
  const caps: AppiumCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': config.get('device.name', 'emulator-5554')!,
  };

  const version = config.get('platform.version');
  if (version) caps['appium:platformVersion'] = version;

  const browser = config.get('browser.name');
  if (browser) {
    caps.browserName = browser;
    caps['appium:chromedriverAutodownload'] = true;
  } else {
    const app = config.get('app.path');
    if (app) caps['appium:app'] = app;

    const appPackage = config.get('app.package');
    if (appPackage) caps['appium:appPackage'] = appPackage;

    const appActivity = config.get('app.activity');
    if (appActivity) caps['appium:appActivity'] = appActivity;
  }

  caps['appium:noReset'] = config.get('no.reset', 'false') === 'true';

  return caps;
}

function buildIOSCapabilities(config: ConfigReader): AppiumCapabilities {
  const caps: AppiumCapabilities = {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': config.get('device.name', 'iPhone 15')!,
  };

  const version = config.get('platform.version');
  if (version) caps['appium:platformVersion'] = version;

  const browser = config.get('browser.name');
  if (browser) {
    caps.browserName = browser;
  } else {
    const app = config.get('app.path');
    if (app) caps['appium:app'] = app;

    const bundleId = config.get('bundle.id');
    if (bundleId) caps['appium:bundleId'] = bundleId;
  }

  const udid = config.get('device.udid');
  if (udid) caps['appium:udid'] = udid;

  caps['appium:noReset'] = config.get('no.reset', 'false') === 'true';

  return caps;
}
