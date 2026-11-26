import { expect, test } from '@playwright/test';

test('button, checkbox, switch, radio and select respond to keyboard and clicks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try a button' }).click();
  await expect(page.locator('ag-button [data-feedback]')).toHaveText('Activated');
  await page.getByRole('checkbox', { name: 'Keep me in the loop' }).check();
  await expect(page.locator('ag-checkbox [data-feedback]')).toHaveText('Selected');
  await page.getByRole('checkbox', { name: 'Keep me in the loop' }).press('Space');
  await expect(page.locator('ag-checkbox [data-feedback]')).toHaveText('Not selected');
  await page.getByRole('switch', { name: 'Gentle reminders' }).click();
  await expect(page.locator('ag-switch [data-feedback]')).toHaveText('On');
  await page.getByRole('radio', { name: 'Weekly', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Monthly', exact: true })).toBeChecked();
  await expect(page.locator('ag-radio [data-feedback]')).toHaveText('Monthly selected');
  await page.getByRole('combobox', { name: 'Your pace' }).click();
  await page.getByRole('option', { name: 'Full speed ahead' }).click();
  await expect(page.locator('ag-select [data-feedback]')).toHaveText('Full speed ahead selected');
});

test('text, numbers, textarea, password and disclosure expose their state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Alex');
  await page.getByRole('textbox', { name: 'Display name' }).press('Tab');
  await expect(page.locator('#ag-input-07 [data-feedback]')).toHaveText('Value accepted');
  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await expect(page.locator('ag-number [data-feedback]')).toHaveText('Quantity: 4');
  await page.getByRole('textbox', { name: 'A little note' }).fill('Hello');
  await expect(page.locator('ag-textarea [data-feedback]')).toHaveText('5 / 200 characters');
  await page.getByRole('textbox', { name: 'A little note' }).press('Enter');
  await expect(page.locator('ag-textarea [data-feedback]')).toHaveText('6 / 200 characters');
  await expect(page.getByRole('button', { name: 'Show password' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.locator('ag-password input')).toHaveAttribute('type', 'text');
  await expect(page.getByRole('button', { name: 'Show password' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('ag-password [data-feedback]')).toHaveText('Password visible');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(page.locator('ag-password input')).toHaveAttribute('type', 'password');
  await expect(page.getByRole('button', { name: 'Show password' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'What makes these accessible?' }).click();
  await expect(page.locator('ui-collapsible-panel')).toBeVisible();
  await expect(page.locator('ag-details [data-feedback]')).toHaveText('Details expanded');
});

test('file acceptance, rejection and removal; progress, meter and native inputs', async ({ page }) => {
  await page.goto('/');
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Choose a file' }).click();
  await (await chooserPromise).setFiles({ name: 'hello.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  await expect(page.locator('ag-file [data-feedback]')).toHaveText('1 file selected');
  await expect(page.locator('[data-file="name"]')).toHaveText('hello.txt');
  await page.getByRole('button', { name: 'Remove hello.txt' }).click();
  await expect(page.locator('ag-file [data-feedback]')).toHaveText('0 files selected');
  const rejected = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Choose a file' }).click();
  await (await rejected).setFiles({ name: 'no.png', mimeType: 'image/png', buffer: Buffer.from('image') });
  await expect(page.locator('ag-file [data-feedback]')).toContainText('File not accepted');
  for (let index = 0; index < 4; index++) await page.getByRole('button', { name: 'Advance 25%' }).click();
  await expect(page.locator('ag-progress [data-feedback]')).toHaveText('Complete');
  await expect(page.getByRole('progressbar', { name: 'Demo task' })).toHaveAttribute('aria-valuenow', '100');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('progressbar', { name: 'Demo task' })).toHaveAttribute('aria-valuenow', '0');
  await page.getByRole('button', { name: 'Read current level' }).click();
  await expect(page.locator('ag-meter [data-feedback]')).toHaveText('65% used');
  await page.getByLabel('Choose a date', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Choose a date', { exact: true }).press('Tab');
  await expect(page.locator('#ag-input-16 ag-input').first().locator('[data-feedback]')).toHaveText('Value accepted');
});

test('mobile layout, reduced motion, unique identifiers, and no runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.widget-card')).toHaveCount(17);
  await page.getByRole('button', { name: 'Increase intensity' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const duplicates = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
});
