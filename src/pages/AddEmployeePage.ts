import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddEmployeePage extends BasePage {
  private readonly firstNameInput = this.page.getByPlaceholder('First Name');
  private readonly lastNameInput = this.page.getByPlaceholder('Last Name');
  private readonly employeeIdInput = this.page.locator('.orangehrm-edit-employee-name input').nth(3);
  private readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  private readonly successToast = this.page.locator('.oxd-toast-content--success');

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
    await this.expectVisible(this.successToast);
  }
}
