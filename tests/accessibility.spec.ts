import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertEnhancedTargets, wcagTags } from './a11y';

test('collection meets automated WCAG AA checks and desktop layout fits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await expect(page.locator('.widget-card')).toHaveCount(17);
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: false });
});

test('index and every test page reflow at 320 CSS pixels with increased text spacing', async ({ page }) => {
  const { componentPages } = await import('../src/pages');
  await page.setViewportSize({ width: 320, height: 900 });
  for (const path of ['/', ...componentPages.map(component => `/components/${component.slug}/`)]) {
    await page.goto(path);
    await page.addStyleTag({ content: `* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }` });
    const overflow = await page.evaluate(() => ({
      viewport: innerWidth, width: document.documentElement.scrollWidth,
      elements: [...document.querySelectorAll<HTMLElement>('body *')]
        .filter(el => el.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(el).position !== 'absolute' && getComputedStyle(el).position !== 'fixed')
        .slice(0, 8).map(el => `${el.tagName}.${el.className}`),
    }));
    expect(overflow.width, `${path}: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(320);
  }
});

test('select popup and expanded disclosure pass WCAG 2.2 checks', async ({ page }) => {
  await page.goto('/components/select/');
  await page.getByRole('combobox', { name: 'Your pace' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('option', { name: 'Take it slow' })).toBeVisible();
  const popup = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(popup.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('combobox', { name: 'Your pace' })).toBeFocused();
  await page.goto('/components/details/');
  await page.getByRole('button', { name: 'What makes these accessible?' }).press('Enter');
  const expanded = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(expanded.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
});

test('skip link moves focus, control names survive, and interaction targets meet the enhanced 44px minimum', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to components' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#playground')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: 'Component test pages' }).getByRole('link').first()).toBeFocused();
  await assertEnhancedTargets(page);
});

test('keyboard focus remains visible and states remain usable in forced colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('/');
  const checkbox = page.getByRole('checkbox', { name: 'Keep me in the loop' });
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  const selected = page.locator('ui-checkbox');
  expect(await selected.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.getByRole('switch', { name: 'Gentle reminders' }).press('Space');
  await expect(page.getByRole('switch', { name: 'Gentle reminders' })).toBeChecked();
  const slider = page.locator('ag-slider input[type="range"]');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('ag-slider output')).toHaveText('51%');
  expect(await page.locator('ui-slider-thumb').evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  expect(await page.locator('ag-slider output').evaluate(el => el.getAnimations().length)).toBe(0);
});

test('invalid input has an associated persistent error and character counts avoid per-key announcements', async ({ page }) => {
  await page.goto('/components/input/');
  const input = page.getByRole('textbox', { name: 'Display name' });
  await input.evaluate(el => { (el as HTMLInputElement).required = true; });
  await input.fill('Alex');
  await input.fill('');
  await input.press('Tab');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription('A value is required');
  const errors = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(errors.violations).toEqual([]);
  await input.fill('Alex');
  await input.press('Tab');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription('Value accepted');
  await page.goto('/components/textarea/');
  await page.getByRole('textbox').fill('Hello');
  await expect(page.locator('[data-feedback]')).toHaveAttribute('aria-live', 'off');
  await expect(page.locator('[data-count-announcement]')).toHaveText('');
  await page.getByRole('textbox').press('Tab');
  await expect(page.locator('[data-count-announcement]')).toHaveText('5 / 200 characters');
});

