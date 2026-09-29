import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';

test.describe('Tasks API', () => {
  test('GET /tasks returns the list of seeded tasks', async ({ request }) => {
    const response = await request.get(`${API_URL}/tasks`);
    expect(response.status()).toBe(200);

    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBeTruthy();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty('title');
    expect(tasks[0]).toHaveProperty('status');
  });

test('POST /tasks creates a task and return the submitted fields' , async ({ request }) => {
  const payload = {
    title: 'API created task',
    description: 'Created from the API test',
    status: 'Open',
  };

  const response = await request.post(`${API_URL}/tasks`, {
    headers: { 'Content-Type': 'application/json' },
    data: payload,
  });
  console.log('POST status', response.status());
  expect(response.status()).toBe(201);  

  const body = await response.json();
  expect(body).toEqual(
    expect.objectContaining({
      title: payload.title,
      description: payload.description,
      status: payload.status,
    })
  );
  expect(body).toHaveProperty('id');
});
});

