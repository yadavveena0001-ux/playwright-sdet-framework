import { test, expect } from '@playwright/test';

test.describe('API @regression', () => {
  const apiBaseURL = 'https://jsonplaceholder.typicode.com'\;

  test('GET /users returns a list of users', async ({ request }) => {
    const response = await request.get(`${apiBaseURL}/users`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('POST /posts creates a resource', async ({ request }) => {
    const response = await request.post(`${apiBaseURL}/posts`, {
      data: { title: 'QA Automation', body: 'SDET test post', userId: 1 },
    });
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('QA Automation');
    expect(body.id).toBeDefined();
  });

  test('GET /users/999 returns 404 for a non-existent user', async ({ request }) => {
    const response = await request.get(`${apiBaseURL}/users/999`);
    expect(response.status()).toBe(404);
  });
});
