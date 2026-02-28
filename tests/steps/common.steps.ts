import { Given } from '@cucumber/cucumber';
import { getDriver } from '../../src/driver/driver-manager.js';
import { logger } from '../support/logger.js';

Given('the {string} opens the url {string}', async function (_user: string, url: string) {
  const driver = getDriver();
  const currentUrl = await driver.getCurrentUrl().catch(() => null);
  if (currentUrl === url) {
    await driver.navigateTo(url);
    logger.info(`Reloaded url: ${url}`);
  } else {
    await driver.navigateTo(url);
  }

  // Wait for page load
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const readyState = await driver.executeScript('return document.readyState');
    if (readyState === 'complete' || readyState === 'interactive') {
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  logger.info(`${_user} opened url: ${url}`);
});
