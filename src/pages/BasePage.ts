import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage centralizes waiting/interaction patterns so individual page
 * objects stay declarative and don't repeat low-level Playwright calls.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    // 'domcontentloaded' instead of the default 'load' — this public demo
    // site keeps background network activity going after the page is
    // usable, which was causing 'load' to time out under parallel load.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForLoadingToFinish() {
    // OrangeHRM shows a spinner overlay during XHR calls; wait for it to detach.
    const spinner = this.page.locator('.oxd-loading-spinner');
    await spinner.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
  }

  async fill(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async click(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectText(locator: Locator, text: string | RegExp) {
    await expect(locator).toHaveText(text);
  }

  async expectToastMessage(message: string) {
    const toast = this.page.locator('.oxd-toast-content');
    await expect(toast).toContainText(message);
  }
}
