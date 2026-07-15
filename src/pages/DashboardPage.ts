import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly userDropdown = this.page.locator('.oxd-userdropdown-tab');
  private readonly logoutOption = this.page.getByRole('menuitem', { name: 'Logout' });
  private readonly widgets = this.page.locator('.oxd-grid-item');
  private readonly sidebarMenu = this.page.locator('.oxd-sidepanel');
  private readonly pageTitle = this.page.locator('.oxd-topbar-header-breadcrumb h6');

  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<boolean> {
    await this.pageTitle.waitFor({ state: 'visible' });
    return (await this.pageTitle.textContent())?.includes('Dashboard') ?? false;
  }

  async getWidgetCount(): Promise<number> {
    return this.widgets.count();
  }

  async navigateTo(menuItem: string) {
    await this.click(this.sidebarMenu.getByText(menuItem, { exact: true }));
    await this.waitForLoadingToFinish();
  }

  async logout() {
    await this.click(this.userDropdown);
    await this.click(this.logoutOption);
  }
}
