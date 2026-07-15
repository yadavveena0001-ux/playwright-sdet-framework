import { test, expect } from '@fixtures/fixtures';

test.describe('Dashboard @regression', () => {
  test('renders the expected widget count after login', async ({ authenticatedPage }) => {
    expect(await authenticatedPage.isLoaded()).toBe(true);

    const widgetCount = await authenticatedPage.getWidgetCount();
    expect(widgetCount).toBeGreaterThan(0);
  });

  test('sidebar navigation opens PIM module', async ({ authenticatedPage, page }) => {
    await authenticatedPage.navigateTo('PIM');

    await expect(page).toHaveURL(/pim/);
  });

  test('logout returns user to the login screen', async ({ authenticatedPage, page }) => {
    await authenticatedPage.logout();

    await expect(page).toHaveURL(/auth\/login/);
  });
});
