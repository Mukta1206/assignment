import { test, expect } from '@playwright/test';
import { TaskManagerPage } from '../pages/TaskManagerPage';

test.describe('Task management', () => {
  test('displays the seeded list of tasks', async ({ page }) => {
    const taskManager = new TaskManagerPage(page);
    await taskManager.goto();

    await expect(taskManager.taskRow('Write report')).toBeVisible();
    await expect(taskManager.taskRow('Buy groceries')).toBeVisible();
  });

  test('creates a new task', async ({ page }) => {
    const taskManager = new TaskManagerPage(page);
    await taskManager.goto();

    await taskManager.createTask('Prepare demo', 'Set up the environment for the client demo', 'Open');

    await expect(taskManager.taskStatusBadge('Prepare demo')).toHaveText('Open');
  });

  test('edits an existing task', async ({ page }) => {
    const taskManager = new TaskManagerPage(page);
    await taskManager.goto();

    await taskManager.editTask('Fix login bug', {
      description: 'Users cannot log in using SSO providers.',
      status: 'In Progress',
    });

    await expect(taskManager.taskStatusBadge('Fix login bug')).toHaveText('In Progress');
    await expect(taskManager.taskRow('Fix login bug')).toContainText('Users cannot log in using SSO providers.');
  });


  test('does not create a task when the title is empty', async ({ page }) => {
    const taskManager = new TaskManagerPage(page);
    await taskManager.goto();

    await taskManager.openNewTaskForm();
    await taskManager.fillTaskForm({ description: 'Missing a title', status: 'Open' });
    await taskManager.submitForm();

    await expect(taskManager.titleError()).toHaveText('Title is required');
    await expect(taskManager.formModal).toBeVisible();
  });


  test('deletes a task', async ({ page }) => {
    const taskManager = new TaskManagerPage(page);
    await taskManager.goto();

    await taskManager.createTask('Temporary task', 'This task will be deleted', 'Open');
    await taskManager.deleteTask('Temporary task');
  });
});
