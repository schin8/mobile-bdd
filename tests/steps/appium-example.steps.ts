import { Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { getDriver } from '../../src/driver/driver-manager.js';

Then('the page title should contain {string}', async function (expected: string) {
  const title = await getDriver().executeScript('return document.title');
  assert.ok(
    typeof title === 'string' && title.includes(expected),
    `Expected title to contain "${expected}" but got: ${title}`,
  );
});

Then('the url should contain {string}', async function (expected: string) {
  const url = await getDriver().getCurrentUrl();
  assert.ok(url.includes(expected), `Expected URL to contain "${expected}" but got: ${url}`);
});
