import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByPlaceholder('Username');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly errorAlert = this.page.locator('.oxd-alert-content-text');
  private readonly forgotPasswordLink = this.page.getByText('Forgot your password?');
  // Client-side "Required" messages shown under empty fields — different from
  // the server-side errorAlert banner, which only appears after a submitted
  // request comes back invalid.
  private readonly requiredFieldErrors = this.page.locator('.oxd-input-field-error-message');

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForLoadingToFinish();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorAlert.textContent();
  }

  async getRequiredFieldErrorCount(): Promise<number> {
    return this.requiredFieldErrors.count();
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }
}
