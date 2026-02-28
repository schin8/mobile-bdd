import {
  Before,
  After,
  AfterAll,
  setDefaultTimeout,
  ITestCaseHookParameter,
} from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import { initDriver, quitDriver } from '../../src/driver/driver-manager.js';
import { logger } from './logger.js';
import {
  HookWorld,
  startScenario,
  attachScreenshotIfFailed,
  formatDuration,
} from './hooks-utils.js';

dotenv.config();

setDefaultTimeout(30_000);

// Note: Keycloak integration removed from the test harness.
// This file now focuses on driver lifecycle and test hooks.

Before({ tags: '@new-browser' }, async function (scenario: ITestCaseHookParameter) {
  const world = this as unknown as HookWorld;
  const platform = process.env.PLATFORM ?? 'android';
  startScenario(world, scenario.pickle.name, platform);

  logger.debug(`@new-browser — restarting driver for: ${scenario.pickle.name}`);
  await quitDriver();
  await initDriver(platform);
  logger.debug('Fresh browser session created');
});

Before({ tags: 'not @api and not @support' }, async function (scenario: ITestCaseHookParameter) {
  const world = this as unknown as HookWorld;
  const platform = process.env.PLATFORM ?? 'android';
  startScenario(world, scenario.pickle.name, platform);
  await initDriver(platform);
  logger.debug('Chrome is active');
});

After({ tags: 'not @api and not @support' }, async function (scenario: ITestCaseHookParameter) {
  const world = this as unknown as HookWorld;

  if (scenario.result?.status === 'FAILED') {
    logger.error(`Scenario failed: ${scenario.pickle.name}`);
    await attachScreenshotIfFailed(world);
  }

  const startTime = world.__startTime ?? Date.now();
  const endTime = Date.now();
  const durationMs = endTime - startTime;
  const pretty = formatDuration(durationMs);

  const status = scenario.result?.status ?? 'UNKNOWN';
  const outcome = status === 'PASSED' ? 'PASSED' : 'FAILED';
  const resultMsg = `Result: ${outcome}`;
  const timingMsg = `duration: ${pretty}`;
  const combined = `${resultMsg} | ${timingMsg}`;

  // final banner uses '=' and matches start banner length when available
  const resultDashes = world.__bannerDashes
    ? '='.repeat(world.__bannerDashes.length)
    : '='.repeat(combined.length);
  logger.info(resultDashes);
  logger.info(combined);
  logger.info(resultDashes);
});

AfterAll(async function () {
  await quitDriver();
});
