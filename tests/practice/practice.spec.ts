import { test, expect } from '@playwright/test';

test('user can login with valid credentials', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // URL confirm karta hai login successful hua
  await expect(page).toHaveURL(/dashboard/);

  // Page ka heading/title text check karo (sidebar ke "Dashboard" link se alag hai)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
