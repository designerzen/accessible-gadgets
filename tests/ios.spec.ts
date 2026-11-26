import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { componentPages } from '../src/pages';
import { assertEnhancedTargets, wcagTags } from './a11y';

test('index supports enhanced contrast, generous touch targets, scalable inputs and unrestricted zoom', async ({ page }) => {
  await page.goto('./');
  await assertEnhancedTargets(page);
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  const reading = await page.evaluate(() => ({
    viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
    inputSizes: [...document.querySelectorAll<HTMLInputElement>('input:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]), textarea')]
      .filter(el => el.getBoundingClientRect().width > 1)
      .map(el => parseFloat(getComputedStyle(el).fontSize)),
    width: document.documentElement.scrollWidth, viewportWidth: innerWidth,
  }));
  expect(reading.viewport).not.toMatch(/user-scalable\s*=\s*(no|0)|maximum-scale\s*=/i);
  expect(reading.inputSizes.every(size => size >= 16)).toBe(true);
  expect(reading.width).toBeLessThanOrEqual(reading.viewportWidth);
  const touchAction = await page.locator('ui-slider-control').evaluate(el => getComputedStyle(el).touchAction);
  expect(touchAction).toContain('pinch-zoom');
  expect(touchAction).toContain('pan-y');
});

test('touch alternatives operate the slider, labels, switch and popup without a drag gesture', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Increase intensity' }).tap();
  await expect(page.locator('ag-slider output')).toHaveText('51%');
  await page.getByRole('button', { name: 'Decrease intensity' }).tap();
  await expect(page.locator('ag-slider output')).toHaveText('50%');
  const label = page.locator('ag-checkbox label');
  await label.tap({ position: { x: 60, y: 40 } });
  await expect(page.getByRole('checkbox')).toBeChecked();
  await page.locator('ag-switch label').tap();
  await expect(page.getByRole('switch')).toBeChecked();
  await page.getByRole('combobox', { name: 'Your pace' }).tap();
  await expect(page.getByRole('option', { name: 'Full speed ahead' })).toBeVisible();
  await assertEnhancedTargets(page);
  await page.getByRole('option', { name: 'Full speed ahead' }).tap();
  await expect(page.locator('ag-select [data-feedback]')).toHaveText('Full speed ahead selected');
});

test('all pages reflow with doubled root text and expanded spacing', async ({ page }) => {
  for (const path of ['./', ...componentPages.map(component => `components/${component.slug}/`)]) {
    await page.goto(path);
    const size = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    await page.addStyleTag({ content: `html { font-size: ${size * 2}px !important; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }` });
    const layout = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
    expect(layout.width, path).toBeLessThanOrEqual(layout.viewport);
    const clipped = await page.locator('button').evaluateAll(buttons => buttons
      .filter(button => button.getClientRects().length && button.scrollHeight > button.clientHeight + 1)
      .map(button => button.outerHTML.slice(0, 80)));
    expect(clipped, path).toEqual([]);
  }
});

test('reduced motion and increased contrast preserve visible keyboard focus and state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', contrast: 'more' });
  await page.goto('components/slider/');
  await page.locator('ag-slider input[type="range"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('ag-slider output')).toHaveText('51%');
  const appearance = await page.locator('ui-slider-thumb').evaluate(el => {
    const box = el.getBoundingClientRect(), style = getComputedStyle(el);
    return { width: box.width, height: box.height, outline: parseFloat(style.outlineWidth), outlineStyle: style.outlineStyle,
      inView: box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth };
  });
  expect(appearance.width).toBeGreaterThanOrEqual(44);
  expect(appearance.height).toBeGreaterThanOrEqual(44);
  expect(appearance.outline).toBeGreaterThanOrEqual(3);
  expect(appearance.outlineStyle).toBe('solid');
  expect(appearance.inView).toBe(true);
  expect(await page.locator('ag-slider output').evaluate(el => el.getAnimations().length)).toBe(0);
});

test('touch audio opt-in, mute and visual fallback match WebKit capabilities', async ({ page }) => {
  await page.goto('components/slider/');
  const available = await page.evaluate(() => typeof AudioContext === 'function');
  if (process.env.AG_REQUIRE_WEB_AUDIO === '1') expect(available, 'macOS WebKit CI requires real Web Audio coverage').toBe(true);
  if (!available) {
    test.info().annotations.push({ type: 'coverage-limit', description: 'This WebKit build has no Web Audio API. Only its unavailable-audio fallback is exercised; macOS CI requires the synthesis branch.' });
    await page.getByRole('button', { name: 'Sound cues', exact: true }).tap();
    await expect(page.locator('#audio-status')).toContainText('unavailable');
    await page.getByRole('button', { name: 'Increase intensity' }).tap();
    await expect(page.locator('ag-slider output')).toHaveText('51%');
    await page.getByRole('button', { name: 'Sound cues', exact: true }).tap();
    await expect(page.getByRole('button', { name: 'Sound cues', exact: true })).toHaveAttribute('aria-pressed', 'false');
    return;
  }
  await page.evaluate(() => {
    (window as any).createdOscillators = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () {
      (window as any).createdOscillators++;
      return original.call(this);
    };
  });
  await page.getByRole('button', { name: 'Increase intensity' }).tap();
  expect(await page.evaluate(() => (window as any).createdOscillators)).toBe(0);
  const toggle = page.getByRole('button', { name: 'Sound cues', exact: true });
  await toggle.tap();
  await expect.poll(() => page.evaluate(() => (window as any).createdOscillators)).toBeGreaterThan(0);
  await expect(page.locator('#audio-status')).not.toContainText('unavailable');
  await toggle.tap();
  const mutedCount = await page.evaluate(() => (window as any).createdOscillators);
  await page.getByRole('button', { name: 'Increase intensity' }).tap();
  await expect(page.locator('ag-slider output')).toHaveText('52%');
  expect(await page.evaluate(() => (window as any).createdOscillators)).toBe(mutedCount);
});
