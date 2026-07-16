import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddEmployeePage extends BasePage {
  private readonly firstNameInput = this.page.getByPlaceholder('First Name');
  private readonly lastNameInput = this.page.getByPlaceholder('Last Name');
  private readonly employeeIdInput = this.page.locator('.orangehrm-edit-employee-name input').nth(3);
  private readonly saveButton = this.page.getByRole('button', { name: 'Save' });

  constructor(page: Page) {
    super(page);
  }

  async fillBasicDetails(firstName: string, lastName: string) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
  }

  async save() {
    await this.click(this.saveButton);
    await this.waitForLoadingToFinish();
  }

  async expectCreationSuccess() {
    // The success toast fades within a few seconds, which is unreliable to
    // assert against under CI network latency. On successful save, OrangeHRM
    // redirects to the new employee's Personal Details page — that URL
    // change is a far more stable signal of success than a transient toast.
    await this.page.waitForURL(/viewPersonalDetails/, { timeout: 20_000 });
  }
}
