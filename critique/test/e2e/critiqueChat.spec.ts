import { test, expect } from '@playwright/test';


test.describe('Chat with Static AI Response', () => {
  test('should display input and submit button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByPlaceholder('enter an idea')).toBeVisible();
    await expect(page.getByRole('button', { name: 'submit' })).toBeVisible();
  });

  test('should keep submit disabled with empty input', async ({ page }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'submit' });
    await expect(button).toBeDisabled();
  });

  test('should enable submit with input and show chat', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('enter an idea');
    const button = page.getByRole('button', { name: 'submit' });

    await input.fill('an idea');
    await expect(button).toBeEnabled();
    await button.click();

    await expect(page.getByTestId('user')).toHaveText('an idea');
    await expect(page.getByText('thinking...')).toBeVisible();
    await expect(page.getByTestId('ai')).toBeVisible({ timeout: 2000 });
  });

  test('should clear chat on new submit', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('an idea');
    const button = page.getByRole('button', { name: 'submit' });

    await input.fill('first');
    await button.click();
    await expect(page.getByTestId('ai')).toBeVisible({ timeout: 2000 });

    await input.fill('second');
    await button.click();
    await expect(page.getByTestId('user')).toHaveText('second');
    await expect(page.getByTestId('ai')).toBeVisible({ timeout: 2000 });
  });

  test('should reset chat on reload', async ({ page }) => {
    await page.goto('/');
    const input = page.getByPlaceholder('enter an idea');
    const button = page.getByRole('button', { name: 'submit' });

    await input.fill('reset chat');
    await button.click();
    await expect(page.getByTestId('ai')).toBeVisible({ timeout: 2000 });

    await page.reload();
    await expect(page.getByPlaceholder('enter an idea')).toHaveValue('');
    await expect(page.locator('[data-testid="user"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="ai"]')).toHaveCount(0);
  });
});
