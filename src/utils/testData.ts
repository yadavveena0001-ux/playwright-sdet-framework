/**
 * Centralized, reusable test data. Keeping this separate from specs makes it
 * easy to swap in a JSON/CSV/DB-backed data provider later without touching
 * any test logic.
 */

export const invalidLoginCases = [
  { username: '', password: '', description: 'empty credentials' },
  { username: 'Admin', password: 'wrongpass', description: 'wrong password' },
  { username: 'not_a_user', password: 'admin123', description: 'unknown username' },
];

export function uniqueEmployeeName(): { firstName: string; lastName: string } {
  const stamp = Date.now();
  return {
    firstName: `QA_${stamp}`,
    lastName: 'Automation',
  };
}
