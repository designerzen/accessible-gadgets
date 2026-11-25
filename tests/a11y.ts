import { expect, type Page } from '@playwright/test';

// axe currently exposes its AAA rules under wcag2aaa. Newer AAA focus/target
// criteria are covered by the explicit interaction and geometry checks.
export const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'wcag2aaa', 'best-practice'];

export async function assertEnhancedTargets(page: Page) {
  const failures = await page.evaluate(() => {
    const controls = [...document.querySelectorAll<HTMLElement>('a[href], button, input, textarea, ui-checkbox, ui-radio, ui-switch, ui-select-item')];
    return controls.flatMap(el => {
      if (el.matches(':disabled') || el.closest('[hidden], [aria-hidden="true"]')) return [];
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return [];
      // Measure the associated activation area rather than the decorative mark
      // or the SDK's hidden native file/range proxy.
      const fileTrigger = el.matches('input[type="file"][tabindex="-1"]')
        ? el.closest('ui-file-input')?.querySelector('ui-file-input-trigger button') : null;
      const target = fileTrigger ?? el.closest('label') ?? el.closest('ui-slider-thumb') ?? el;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return [];
      return rect.width < 43.99 || rect.height < 43.99
        ? [{ tag: el.tagName, name: el.getAttribute('aria-label') || el.textContent?.trim(), width: rect.width, height: rect.height }] : [];
    });
  });
  expect(failures, 'Author-controlled targets must be at least 44×44 CSS pixels').toEqual([]);
}
