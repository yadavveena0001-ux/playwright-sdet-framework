import { test, expect } from '@playwright/test';

/**
 * Demonstrates API-layer testing with Playwright's built-in request context —
 * no browser needed. In a real project this would hit your own service's
 * REST/GraphQL endpoints; reqres.in is used here as a stand-in public API
 * so the suite is runnable out of the box.
 */
test.describe('API @regression', () => {
  const apiBaseURL = 'https://reqres.in/api';

  test('GET /users returns a paginated list', async ({ request }) => {
    const response = await request.get(`${apiBaseURL}/users?page=2`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('POST /users creates a resource', async ({ request }) => {
    const response = await request.post(`${apiBaseURL}/users`, {
      data: { name: 'QA Automation', job: 'SDET' },
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe('QA Automation');
    expect(body.id).toBeDefined();
  });

  test('GET /users/23 returns 404 for a non-existent user', async ({ request }) => {
    const response = await request.get(`${apiBaseURL}/users/23`);
    expect(response.status()).toBe(404);
  });
});
