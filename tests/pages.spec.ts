import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { componentPages } from '../src/pages';
import { assertEnhancedTargets, wcagTags } from './a11y';

for (const component of componentPages) {
  test(`${component.title} has a linked, accessible live test page`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith('http://127.0.0.1:') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto('./');
    await page.getByRole('navigation', { name: 'Component test pages' }).getByRole('link', { name: component.title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/components/${component.slug}/$`));
    await page.reload(); // Direct requests must resolve a real page after deployment.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(component.title);
    await expect(page.locator('.widget-card')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Usage & code' })).toBeVisible();
    await expect(page.locator('.component-docs .code-block')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Things to check' })).toBeVisible();
    const breakdownHeading = page.getByRole('heading', { name: 'Accessibility & inclusion considerations' });
    await expect(breakdownHeading).toBeVisible();
    const layoutOrder = await page.evaluate(() => {
      const card = document.querySelector('.widget-card')!.getBoundingClientRect();
      const docs = document.querySelector('.component-docs')!.getBoundingClientRect();
      const checklist = document.querySelector('.test-checklist')!.getBoundingClientRect();
      const breakdown = document.querySelector('.a11y-breakdown')!.getBoundingClientRect();
      return {
        belowCard: breakdown.top >= card.bottom - 1,
        belowDocs: breakdown.top >= docs.bottom - 1,
        belowChecklist: breakdown.top >= checklist.bottom - 1,
      };
    });
    expect(layoutOrder).toEqual({ belowCard: true, belowDocs: true, belowChecklist: true });
    await assertEnhancedTargets(page);
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);

    switch (component.slug) {
      case 'slider':
        await page.getByRole('button', { name: 'Increase intensity' }).click();
        await expect(page.locator('ag-slider output')).toHaveText('51%');
        break;
      case 'button':
        await page.getByRole('button', { name: 'Try a button' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('Activated');
        break;
      case 'checkbox':
        await page.getByRole('checkbox').check();
        await expect(page.locator('[data-feedback]')).toHaveText('Selected');
        break;
      case 'switch':
        await page.getByRole('switch').click();
        await expect(page.locator('[data-feedback]')).toHaveText('On');
        break;
      case 'radio':
        await page.getByRole('radio', { name: 'Daily', exact: true }).check();
        await expect(page.locator('[data-feedback]')).toHaveText('Daily selected');
        break;
      case 'select':
        await page.getByRole('combobox', { name: 'Your pace' }).click();
        await page.getByRole('option', { name: 'Take it slow' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('Take it slow selected');
        break;
      case 'input':
        await page.getByRole('textbox').fill('Alex');
        await page.getByRole('textbox').press('Tab');
        await expect(page.locator('[data-feedback]')).toHaveText('Value accepted');
        break;
      case 'number':
        await page.getByRole('button', { name: 'Increase quantity' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('Quantity: 4');
        break;
      case 'textarea':
        await page.getByRole('textbox').fill('Hello');
        await expect(page.locator('[data-feedback]')).toHaveText('5 / 200 characters');
        break;
      case 'password':
        await page.getByRole('button', { name: 'Show password' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('Password visible');
        break;
      case 'file': {
        const chooser = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'Choose a file' }).click();
        await (await chooser).setFiles({ name: 'hello.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
        await expect(page.locator('[data-feedback]')).toHaveText('1 file selected');
        break;
      }
      case 'details':
        await page.getByRole('button', { name: 'What makes these accessible?' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('Details expanded');
        break;
      case 'progress':
        await page.getByRole('button', { name: 'Advance 25%' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('25% complete');
        break;
      case 'meter':
        await page.getByRole('button', { name: 'Read current level' }).click();
        await expect(page.locator('[data-feedback]')).toHaveText('65% used');
        break;
      case 'link':
        await page.getByRole('link', { name: 'Back to the slider' }).click();
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Slider');
        await page.goBack();
        break;
      case 'date-time':
        await page.getByLabel('Choose a date', { exact: true }).fill('2026-12-01');
        await page.getByLabel('Choose a date', { exact: true }).press('Tab');
        await expect(page.locator('[data-feedback]').first()).toHaveText('Value accepted');
        break;
      case 'color':
        await page.getByLabel('Accent color').evaluate((el: HTMLInputElement) => {
          el.value = '#ff0000';
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        await expect(page.locator('[data-feedback]')).toHaveText('Value accepted');
        break;
    }
    const changedState = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    expect(changedState.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.getByRole('button', { name: 'Reset example', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(component.title);
    await page.getByRole('navigation', { name: 'Component pages' }).getByRole('link', { name: 'Component index' }).click();
    await expect(page.getByRole('navigation', { name: 'Component test pages' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
