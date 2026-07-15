import { test, expect } from '@fixtures/fixtures';
import { invalidLoginCases } from '@utils/testData';

test.describe('Login @smoke', () => {
  test('valid credentials land on the dashboard', async ({ loginPage, dashboardPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.ADMIN_USERNAME || 'Admin',
      process.env.ADMIN_PASSWORD || 'admin123'
    );

    expect(await dashboardPage.isLoaded()).toBe(true);
  });

  for (const testCase of invalidLoginCases) {
    test(`rejects login with ${testCase.description}`, async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(testCase.username, testCase.password);

      if (testCase.username === '' || testCase.password === '') {
        // Empty fields never reach the server — client-side validation
        // blocks submission and shows per-field "Required" messages instead
        // of the server error banner.
        expect(await loginPage.getRequiredFieldErrorCount()).toBeGreaterThan(0);
      } else {
        const error = await loginPage.getErrorMessage();
        expect(error).toBeTruthy();
      }
    });
  }

  test('forgot password link routes to reset flow', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });
});
