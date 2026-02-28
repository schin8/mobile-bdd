import { AppiumClient } from '../../src/appium/client.js';
import type { AppiumElement } from '../../src/appium/client.js';
import { By } from '../../src/appium/types.js';
import { getDriver } from '../../src/driver/driver-manager.js';

const DEFAULT_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 500;

/**
 * Abstract base page — provides common Appium helpers.
 */
export abstract class BasePage {
  protected driver(): AppiumClient {
    return getDriver();
  }

  protected async waitForElement(
    locator: By,
    timeout = DEFAULT_TIMEOUT_MS,
  ): Promise<AppiumElement> {
    const deadline = Date.now() + timeout;
    let lastError: Error | undefined;

    while (Date.now() < deadline) {
      try {
        const el = await this.driver().findElement(locator);
        if (await el.isDisplayed()) return el;
      } catch (e) {
        lastError = e as Error;
      }
      await sleep(POLL_INTERVAL_MS);
    }

    throw new Error(
      `Timed out waiting for element ${locator} (${timeout}ms). Last error: ${lastError?.message}`,
    );
  }

  protected async waitForClickable(
    locator: By,
    timeout = DEFAULT_TIMEOUT_MS,
  ): Promise<AppiumElement> {
    const deadline = Date.now() + timeout;
    let lastError: Error | undefined;

    while (Date.now() < deadline) {
      try {
        const el = await this.driver().findElement(locator);
        if ((await el.isDisplayed()) && (await el.isEnabled())) return el;
      } catch (e) {
        lastError = e as Error;
      }
      await sleep(POLL_INTERVAL_MS);
    }

    throw new Error(
      `Timed out waiting for clickable element ${locator} (${timeout}ms). Last error: ${lastError?.message}`,
    );
  }

  protected async tap(locator: By): Promise<void> {
    const el = await this.waitForClickable(locator);
    await el.click();
  }

  protected async type(locator: By, text: string): Promise<void> {
    const el = await this.waitForElement(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  protected async getText(locator: By): Promise<string> {
    const el = await this.waitForElement(locator);
    return el.getText();
  }

  protected async isDisplayed(locator: By): Promise<boolean> {
    try {
      const el = await this.waitForElement(locator);
      return el.isDisplayed();
    } catch {
      return false;
    }
  }

  protected async findElements(locator: By): Promise<AppiumElement[]> {
    return this.driver().findElements(locator);
  }

  /** Add a red border around an element so screenshots show what the test is looking at. */
  protected async highlight(locator: By): Promise<void> {
    if (locator.using !== 'css selector') return;
    await this.driver().executeScript(
      `var el = document.querySelector(arguments[0]);
       if (!el) return;
       el.style.outline = '4px solid red';
       el.style.outlineOffset = '2px';`,
      [locator.value],
    );
  }

  /** Remove the red border from a previously highlighted element. */
  protected async clearHighlight(locator: By): Promise<void> {
    if (locator.using !== 'css selector') return;
    await this.driver().executeScript(
      `var el = document.querySelector(arguments[0]);
       if (!el) return;
       el.style.outline = '';
       el.style.outlineOffset = '';`,
      [locator.value],
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
