import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  private readonly addButton = this.page.getByRole('button', { name: 'Add' });
  private readonly employeeNameInput = this.page.getByPlaceholder('Type for hints...');
  private readonly searchButton = this.page.getByRole('button', { name: 'Search' });
  private readonly resultsTable = this.page.locator('.oxd-table-body');
  private readonly resultsRows = this.resultsTable.locator('.oxd-table-row');
  private readonly recordsFoundText = this.page.locator('.orangehrm-horizontal-padding span');
  private readonly deleteSelectedButton = this.page.getByRole('button', { name: 'Delete Selected' });
  private readonly confirmDeleteButton = this.page.getByRole('button', { name: 'Yes, Delete' });

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/web/index.php/pim/viewEmployeeList');
    await this.waitForLoadingToFinish();
  }

  async clickAddEmployee() {
    await this.click(this.addButton);
  }

  async searchByName(name: string) {
    await this.fill(this.employeeNameInput, name);
    await this.page.getByText(name).first().click().catch(() => {
      // autosuggest dropdown may not appear for freshly created records; ignore.
    });
    await this.click(this.searchButton);
    await this.waitForLoadingToFinish();
  }

  async getResultsCount(): Promise<number> {
    return this.resultsRows.count();
  }

  async getRecordsFoundLabel(): Promise<string | null> {
    return this.recordsFoundText.first().textContent();
  }

  async deleteFirstResult() {
    await this.click(this.resultsRows.first().locator('input[type="checkbox"]'));
    await this.click(this.deleteSelectedButton);
    await this.click(this.confirmDeleteButton);
    await this.waitForLoadingToFinish();
  }
}
