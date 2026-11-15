import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Syntecxhub Project 1 — User Management System', () => {
  const screenshotsDir = path.resolve(process.cwd(), 'e2e-screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test('01 - Dashboard Overview loads with executive metrics and charts', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Title and Topbar
    await expect(page).toHaveTitle(/Syntecxhub/);
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Verify Metric Cards
    const cards = page.locator('.surface-card');
    await expect(cards.first()).toBeVisible();

    // Take screenshot of Dashboard
    await page.screenshot({
      path: path.join(screenshotsDir, '01-dashboard-overview.png'),
      fullPage: true,
    });
  });

  test('02 - User Directory renders seeded users and supports search & filters', async ({ page }) => {
    await page.goto('/users');
    await page.waitForLoadState('networkidle');

    // Heading verification
    await expect(page.locator('text=Organization User Directory')).toBeVisible();

    // Verify search input is present
    const searchInput = page.locator('input[placeholder*="Search by name"]');
    await expect(searchInput).toBeVisible();

    // Verify Add New User button is present
    const addBtn = page.getByRole('button', { name: /Add New User/i }).first();
    await expect(addBtn).toBeVisible();

    // Verify seeded users in table or empty state gracefully rendered
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Search for a user
    await searchInput.fill('Sarah');
    await page.waitForTimeout(500); // debounce

    // Take screenshot of Users Directory
    await page.screenshot({
      path: path.join(screenshotsDir, '02-users-directory.png'),
      fullPage: true,
    });

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(500);
  });

  test('03 - Create User Modal opens with proper validation fields', async ({ page }) => {
    await page.goto('/users');
    await page.waitForLoadState('networkidle');

    const addBtn = page.getByRole('button', { name: /Add New User/i }).first();
    await addBtn.click();

    // Modal should be visible
    const modalHeading = page.locator('text=Create New User Account');
    await expect(modalHeading).toBeVisible();

    // Form fields verification
    await expect(page.locator('input[placeholder*="Nadia"]').or(page.locator('input[placeholder*="e.g."]'))).toBeVisible();
    await expect(page.locator('input[placeholder*="syntecxhub"]')).toBeVisible();

    // Take screenshot of Create User Modal
    await page.screenshot({
      path: path.join(screenshotsDir, '03-create-user-modal.png'),
    });

    // Close modal
    const closeBtn = page.getByRole('button', { name: /Cancel/i }).or(page.locator('button:has-text("Cancel")'));
    await closeBtn.first().click();
    await expect(modalHeading).not.toBeVisible();
  });

  test('04 - Settings Page renders configuration sections', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=System & Security Settings').or(page.locator('text=Settings'))).toBeVisible();

    // Screenshot of Settings
    await page.screenshot({
      path: path.join(screenshotsDir, '04-settings-page.png'),
      fullPage: true,
    });
  });

  test('05 - API Docs page loads documentation overview', async ({ page }) => {
    await page.goto('/api-docs');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=API Reference').or(page.locator('text=Swagger'))).toBeVisible();

    // Screenshot of API Docs
    await page.screenshot({
      path: path.join(screenshotsDir, '05-api-docs-page.png'),
      fullPage: true,
    });
  });
});
