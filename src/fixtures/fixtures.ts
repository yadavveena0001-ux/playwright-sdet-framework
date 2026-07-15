import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PimPage } from '@pages/PimPage';
import { AddEmployeePage } from '@pages/AddEmployeePage';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  pimPage: PimPage;
  addEmployeePage: AddEmployeePage;
};

type AuthFixture = {
  /** Provides a page that is already logged in as Admin. */
  authenticatedPage: DashboardPage;
};

/**
 * Extends Playwright's base test with:
 *  - page object fixtures (so specs never call `new XPage(page)` directly)
 *  - an `authenticatedPage` fixture that handles login once per test,
 *    keeping login mechanics out of every regression spec.
 */
export const test = base.extend<Pages & AuthFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(
      process.env.ADMIN_USERNAME || 'Admin',
      process.env.ADMIN_PASSWORD || 'admin123'
    );
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
