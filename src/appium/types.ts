/** W3C WebDriver element identifier key. */
export const W3C_ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf';

/** Locator strategy + value (equivalent to Selenium's By). */
export class By {
  constructor(
    public readonly using: string,
    public readonly value: string,
  ) {}

  static css(selector: string): By {
    return new By('css selector', selector);
  }

  static xpath(expression: string): By {
    return new By('xpath', expression);
  }

  static id(id: string): By {
    return new By('id', id);
  }

  static className(name: string): By {
    return new By('class name', name);
  }

  static linkText(text: string): By {
    return new By('link text', text);
  }

  static partialLinkText(text: string): By {
    return new By('partial link text', text);
  }

  static tagName(tag: string): By {
    return new By('tag name', tag);
  }

  /** Appium-specific: accessibility id. */
  static accessibilityId(id: string): By {
    return new By('accessibility id', id);
  }

  toString(): string {
    return `By(${this.using}, ${this.value})`;
  }
}

/** Capabilities passed to Appium session creation. */
export interface AppiumCapabilities {
  platformName: string;
  'appium:automationName': string;
  'appium:deviceName': string;
  'appium:platformVersion'?: string;
  browserName?: string;
  'appium:app'?: string;
  'appium:bundleId'?: string;
  'appium:appPackage'?: string;
  'appium:appActivity'?: string;
  'appium:udid'?: string;
  'appium:noReset'?: boolean;
  'appium:chromedriverAutodownload'?: boolean;
  'appium:chromedriverExecutable'?: string;
  [key: string]: unknown;
}

/** W3C WebDriver error response body. */
export interface WebDriverError {
  error: string;
  message: string;
  stacktrace?: string;
}
