import { expect, test } from '@playwright/test';

test('slider changes in real time with buttons, keyboard and pointer', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const slider = page.locator('ag-slider');
  const range = slider.locator('input[type="range"]');
  await expect(slider.locator('output')).toHaveText('50%');
  await page.getByRole('button', { name: 'Increase intensity' }).click();
  await expect(slider.locator('output')).toHaveText('51%');
  await page.getByRole('button', { name: 'Decrease intensity' }).click();
  await expect(slider.locator('output')).toHaveText('50%');
  await range.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider.locator('output')).toHaveText('51%');
  await page.keyboard.press('Home');
  await expect(slider.locator('output')).toHaveText('0%');
  await expect(page.getByRole('button', { name: 'Decrease intensity' })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('End');
  await expect(slider.locator('output')).toHaveText('100%');
  const rail = await slider.locator('ui-slider-track').boundingBox();
  await page.mouse.move(rail!.x + rail!.width, rail!.y + 3);
  await page.mouse.down();
  await page.mouse.move(rail!.x + rail!.width * .25, rail!.y + 3, { steps: 10 });
  await expect(slider.locator('output')).toHaveText('25%');
  await page.mouse.up();
  expect(errors).toEqual([]);
});

test('decimal steps, forms, reset, disabled, and read-only', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const form = document.createElement('form');
    form.id = 'test-form';
    form.innerHTML = '<ag-slider label="Opacity" name="opacity" min="0" max="1" step="0.1" value="0.2"></ag-slider><button type="reset">Reset test</button>';
    document.body.append(form);
  });
  const slider = page.locator('#test-form ag-slider');
  await page.getByRole('button', { name: 'Increase opacity' }).click();
  await expect(slider.locator('output')).toHaveText('0.3');
  expect(await page.evaluate(() => new FormData(document.querySelector<HTMLFormElement>('#test-form')!).get('opacity'))).toBe('0.3');
  await page.getByRole('button', { name: 'Reset test' }).click();
  await expect(slider.locator('output')).toHaveText('0.2');
  await slider.evaluate(el => el.setAttribute('read-only', ''));
  await expect(page.getByRole('button', { name: 'Increase opacity' })).toBeDisabled();
  await slider.locator('input[type="range"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider.locator('output')).toHaveText('0.2');
  await slider.evaluate(el => el.setAttribute('disabled', ''));
  expect(await page.evaluate(() => new FormData(document.querySelector<HTMLFormElement>('#test-form')!).get('opacity'))).toBeNull();
});
