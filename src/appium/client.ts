import { By, W3C_ELEMENT_ID, type AppiumCapabilities, type WebDriverError } from './types.js';

/**
 * Lightweight Appium client that speaks the W3C WebDriver protocol directly.
 * No WebdriverIO — just HTTP calls to the Appium server.
 */
export class AppiumClient {
  private sessionId: string | null = null;

  constructor(private readonly serverUrl: string) {}

  getSessionId(): string {
    if (!this.sessionId) throw new Error('No active Appium session');
    return this.sessionId;
  }

  // ── Session ────────────────────────────────────────────────────────

  async createSession(capabilities: AppiumCapabilities): Promise<void> {
    const body = {
      capabilities: { alwaysMatch: capabilities },
    };
    const res = await this.request('POST', '/session', body);
    this.sessionId = res.sessionId ?? res.value?.sessionId;
    if (!this.sessionId) {
      throw new Error(`Failed to create session: ${JSON.stringify(res)}`);
    }
  }

  async deleteSession(): Promise<void> {
    if (!this.sessionId) return;
    await this.request('DELETE', `/session/${this.sessionId}`);
    this.sessionId = null;
  }

  // ── Navigation ─────────────────────────────────────────────────────

  async navigateTo(url: string): Promise<void> {
    await this.sessionRequest('POST', '/url', { url });
  }

  async getCurrentUrl(): Promise<string> {
    const res = await this.sessionRequest('GET', '/url');
    return res.value;
  }

  async getPageSource(): Promise<string> {
    const res = await this.sessionRequest('GET', '/source');
    return res.value;
  }

  // ── Elements ───────────────────────────────────────────────────────

  async findElement(by: By): Promise<AppiumElement> {
    const res = await this.sessionRequest('POST', '/element', {
      using: by.using,
      value: by.value,
    });
    const elementId = res.value[W3C_ELEMENT_ID];
    return new AppiumElement(this, elementId);
  }

  async findElements(by: By): Promise<AppiumElement[]> {
    const res = await this.sessionRequest('POST', '/elements', {
      using: by.using,
      value: by.value,
    });
    return (res.value as Record<string, string>[]).map(
      (el) => new AppiumElement(this, el[W3C_ELEMENT_ID]),
    );
  }

  // ── Timeouts ───────────────────────────────────────────────────────

  async setImplicitWait(ms: number): Promise<void> {
    await this.sessionRequest('POST', '/timeouts', { implicit: ms });
  }

  // ── Script execution ──────────────────────────────────────────────

  async executeScript(script: string, args: unknown[] = []): Promise<unknown> {
    const res = await this.sessionRequest('POST', '/execute/sync', { script, args });
    return res.value;
  }

  // ── Screenshot ─────────────────────────────────────────────────────

  async takeScreenshot(): Promise<Buffer> {
    const res = await this.sessionRequest('GET', '/screenshot');
    return Buffer.from(res.value, 'base64');
  }

  // ── Element sub-requests (called by AppiumElement) ─────────────────

  /** @internal */
  async elementRequest(
    method: string,
    elementId: string,
    path: string,
    body?: unknown,
  ): Promise<any> {
    return this.sessionRequest(method, `/element/${elementId}${path}`, body);
  }

  // ── HTTP transport ─────────────────────────────────────────────────

  private async sessionRequest(method: string, path: string, body?: unknown): Promise<any> {
    return this.request(method, `/session/${this.getSessionId()}${path}`, body);
  }

  private async request(method: string, path: string, body?: unknown): Promise<any> {
    const url = `${this.serverUrl}${path}`;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const json: any = await response.json();

    if (!response.ok || json.value?.error) {
      const err = (json.value ?? json) as WebDriverError;
      throw new Error(`Appium ${method} ${path} failed: [${err.error}] ${err.message}`);
    }

    return json;
  }
}

/**
 * Wraps a remote Appium element — all interaction goes through the W3C protocol.
 */
export class AppiumElement {
  constructor(
    private readonly client: AppiumClient,
    public readonly elementId: string,
  ) {}

  async click(): Promise<void> {
    await this.client.elementRequest('POST', this.elementId, '/click', {});
  }

  async clear(): Promise<void> {
    await this.client.elementRequest('POST', this.elementId, '/clear', {});
  }

  async sendKeys(text: string): Promise<void> {
    await this.client.elementRequest('POST', this.elementId, '/value', { text });
  }

  async getText(): Promise<string> {
    const res = await this.client.elementRequest('GET', this.elementId, '/text');
    return res.value;
  }

  async getAttribute(name: string): Promise<string | null> {
    const res = await this.client.elementRequest('GET', this.elementId, `/attribute/${name}`);
    return res.value;
  }

  async isDisplayed(): Promise<boolean> {
    const res = await this.client.elementRequest('GET', this.elementId, '/displayed');
    return res.value === true;
  }

  async isEnabled(): Promise<boolean> {
    const res = await this.client.elementRequest('GET', this.elementId, '/enabled');
    return res.value === true;
  }

  async findElement(by: By): Promise<AppiumElement> {
    const res = await this.client.elementRequest('POST', this.elementId, '/element', {
      using: by.using,
      value: by.value,
    });
    return new AppiumElement(this.client, res.value[W3C_ELEMENT_ID]);
  }

  async findElements(by: By): Promise<AppiumElement[]> {
    const res = await this.client.elementRequest('POST', this.elementId, '/elements', {
      using: by.using,
      value: by.value,
    });
    return (res.value as Record<string, string>[]).map(
      (el) => new AppiumElement(this.client, el[W3C_ELEMENT_ID]),
    );
  }
}
