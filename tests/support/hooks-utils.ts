import { logger } from './logger.js';
import { getDriver } from '../../src/driver/driver-manager.js';

export type HookWorld = {
  __startTime?: number;
  attach?: (data: string, mime?: string) => void;
  __bannerDashes?: string;
};

export function formatDuration(ms: number): string {
  const totalMs = Math.max(0, Math.floor(ms));
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  const millis = totalMs % 1000;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const mmm = String(millis).padStart(3, '0');

  if (hours > 0) {
    return `${hh}:${mm}:${ss}.${mmm}`;
  }
  return `${mm}:${ss}.${mmm}`;
}

export async function screenshotToBase64(screenshot: unknown): Promise<string> {
  if (typeof screenshot === 'string') return screenshot;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(screenshot as Buffer)) {
    return (screenshot as Buffer).toString('base64');
  }
  const maybe = screenshot as { toString?: () => string } | undefined;
  if (maybe && typeof maybe.toString === 'function') {
    try {
      return Buffer.from(maybe.toString()).toString('base64');
    } catch (err) {
      logger.debug(`toString conversion failed for screenshot: ${String(err)}`);
      return String(maybe);
    }
  }
  return String(screenshot);
}

export async function attachScreenshotIfFailed(world: HookWorld): Promise<void> {
  try {
    const screenshot: unknown = await getDriver().takeScreenshot();
    const payload = await screenshotToBase64(screenshot);
    if (world.attach) world.attach(payload, 'image/png');
  } catch (err) {
    logger.warn(`Could not capture screenshot on failure: ${String(err)}`);
  }
}

export function startScenario(world: HookWorld, scenarioName: string, platform: string): void {
  world.__startTime = Date.now();
  const msg = `Starting scenario: ${scenarioName} on platform: ${platform}`;
  const dashes = '='.repeat(msg.length);
  logger.info(msg);
 // logger.info(dashes);
  // preserve the exact start banner length for the final banner
  world.__bannerDashes = dashes;
}
