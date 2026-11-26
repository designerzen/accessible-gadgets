import { afterEach, describe, expect, it } from 'vitest';
import { commands, page, userEvent } from 'vitest/browser';
import { componentPages } from '../src/pages';
import {
  assertHeadingHierarchy,
  assertLandmarks,
  assertTargetSizes,
  assertUniqueIdsAndValidAriaRefs,
  injectTestStyle,
  mountPage,
  nextFrame,
  resetEnvironment,
  runAxe,
} from './vitest-helpers';

describe('Index page accessibility and inclusion', () => {
  let cleanup: (() => void) | undefined;

  afterEach(async () => {
    cleanup?.();
    cleanup = undefined;
    await resetEnvironment();
  });

  it('passes WCAG 2.2 A/AA/AAA axe checks in light and dark modes with proper landmarks, headings, and targets', async () => {
    const mounted = mountPage();
    cleanup = mounted.dispose;
    await nextFrame();

    expect(document.title).toBe('Accessible Gadgets — Accessible Web Components');
    expect(document.querySelectorAll('.widget-card')).toHaveLength(17);
    expect(document.querySelectorAll('.cue-tag, .component-number')).toHaveLength(0);
    expect([...document.querySelectorAll('.widget-card h3')].map(el => el.textContent?.trim())).toEqual(
      componentPages.map(page => page.title),
    );
    expect(document.querySelectorAll('.card-code summary')).toHaveLength(componentPages.length);
    assertLandmarks();
    assertHeadingHierarchy();
    assertUniqueIdsAndValidAriaRefs();
    assertTargetSizes();
    await runAxe();

    await commands.emulateMedia({ colorScheme: 'dark' });
    await nextFrame();
    await runAxe();
  });

  it('skip link moves focus into the component collection and continues forward tabbing cleanly', async () => {
    const mounted = mountPage();
    cleanup = mounted.dispose;
    await nextFrame();

    await userEvent.tab();
    const skipLink = document.querySelector<HTMLAnchorElement>('.skip-link')!;
    expect(document.activeElement).toBe(skipLink);
    await userEvent.keyboard('{Enter}');
    expect(document.activeElement).toBe(document.querySelector('#playground'));
    await userEvent.tab();
    const firstDirLink = document.querySelector('.component-directory a');
    expect(document.activeElement).toBe(firstDirLink);
  });

  it('reflows cleanly at 320px width with WCAG 1.4.12 text spacing', async () => {
    const mounted = mountPage();
    cleanup = mounted.dispose;
    await page.viewport(320, 900);
    injectTestStyle('* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }');
    await nextFrame();

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);
  });
});

describe.each(componentPages)('$title page ($slug) accessibility, inclusion, and breakdown', component => {
  let cleanup: (() => void) | undefined;

  afterEach(async () => {
    cleanup?.();
    cleanup = undefined;
    await resetEnvironment();
  });

  it('passes WCAG 2.2 A/AA/AAA axe checks in light and dark modes, landmarks, headings, IDs, and targets', async () => {
    const mounted = mountPage(component.slug);
    cleanup = mounted.dispose;
    await nextFrame();

    expect(document.title).toBe(`${component.title} test — Accessible Gadgets`);
    expect(document.querySelectorAll('.widget-card')).toHaveLength(1);
    expect(document.querySelectorAll('.widget-card h3, .cue-tag, .component-number')).toHaveLength(0);
    expect(document.querySelector('.component-docs')).not.toBeNull();
    expect(document.querySelector('[data-code-source]')?.textContent?.trim().length).toBeGreaterThan(10);
    assertLandmarks();
    assertHeadingHierarchy();
    assertUniqueIdsAndValidAriaRefs();
    assertTargetSizes();
    await runAxe();

    await commands.emulateMedia({ colorScheme: 'dark' });
    await nextFrame();
    await runAxe();
  });

  it('places the accessibility considerations breakdown strictly below all primary component info and includes all required sections', async () => {
    const mounted = mountPage(component.slug);
    cleanup = mounted.dispose;
    await nextFrame();

    const intro = document.querySelector<HTMLElement>('.intro')!;
    const preferencesBar = document.querySelector<HTMLElement>('.preferences-bar')!;
    const card = document.querySelector<HTMLElement>('.widget-card')!;
    const docs = document.querySelector<HTMLElement>('.component-docs')!;
    const checklist = document.querySelector<HTMLElement>('.test-checklist')!;
    const breakdown = document.querySelector<HTMLElement>('.a11y-breakdown')!;

    expect(breakdown).not.toBeNull();
    expect(breakdown.querySelector('h2')?.textContent?.trim()).toBe('Accessibility & inclusion considerations');

    // DOM order strictly follows primary component content
    for (const prior of [intro, preferencesBar, card, docs, checklist]) {
      expect(prior.compareDocumentPosition(breakdown) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      const priorRect = prior.getBoundingClientRect();
      const breakdownRect = breakdown.getBoundingClientRect();
      expect(breakdownRect.top).toBeGreaterThanOrEqual(priorRect.bottom - 1);
    }

    expect(breakdown.querySelector('.a11y-breakdown-summary')?.textContent?.trim().length).toBeGreaterThan(20);
    const criteria = breakdown.querySelectorAll('.a11y-criteria li');
    expect(criteria.length).toBeGreaterThanOrEqual(4);

    const subheadings = [...breakdown.querySelectorAll('.a11y-breakdown-card h3')].map(el => el.textContent?.trim());
    expect(subheadings).toEqual([
      'Semantics & screen readers',
      'Keyboard & motor inclusion',
      'Visual, contrast & sensory inclusion',
      'Cognitive, language & platform inclusion',
    ]);
    for (const cardEl of breakdown.querySelectorAll('.a11y-breakdown-card')) {
      expect(cardEl.querySelectorAll('li').length).toBeGreaterThanOrEqual(1);
    }
  });

  it('reflows at 320px width with text spacing and handles 200% root text scaling without button clipping', async () => {
    const mounted = mountPage(component.slug);
    cleanup = mounted.dispose;
    await page.viewport(320, 900);
    const baseSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    injectTestStyle(`html { font-size: ${baseSize * 2}px !important; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }`);
    await nextFrame();

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);
    const clippedButtons = [...document.querySelectorAll('button')].filter(
      button => button.getClientRects().length > 0 && button.scrollHeight > button.clientHeight + 1,
    );
    expect(clippedButtons).toEqual([]);
  });
});
