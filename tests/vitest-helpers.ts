import axe from 'axe-core';
import { expect } from 'vitest';
import { commands, page } from 'vitest/browser';
import { renderApp } from '../src/app';
import { audio } from '../src/audio';
import { theme } from '../src/theme';
import '../src/components/index';
import '../src/style.css';

export const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'wcag2aaa', 'best-practice'];

export function mountPage(slug?: string) {
  localStorage.clear();
  theme.reset();
  audio.setEnabled(false);
  audio.setVolume(0.35);
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  if (slug) {
    document.body.dataset.component = slug;
  } else {
    delete document.body.dataset.component;
  }
  document.body.innerHTML = `<a class="skip-link" href="#playground">${slug ? 'Skip to component' : 'Skip to components'}</a><div id="app"></div>`;
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const rendered = renderApp(app, slug);
  return {
    app,
    dispose: () => {
      rendered.dispose();
      document.body.innerHTML = '';
      delete document.body.dataset.component;
    },
  };
}

export async function resetEnvironment() {
  document.querySelectorAll('[data-test-style]').forEach(el => el.remove());
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
  localStorage.clear();
  theme.reset();
  audio.setEnabled(false);
  audio.setVolume(0.35);
  await commands.emulateMedia({
    colorScheme: 'light',
    forcedColors: 'none',
    reducedMotion: 'no-preference',
    contrast: 'no-preference',
  });
  await page.viewport(1280, 900);
}

export async function runAxe(context: Element | Document = document) {
  const results = await axe.run(context, {
    runOnly: { type: 'tag', values: wcagTags },
  });
  expect(
    results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })),
    })),
  ).toEqual([]);
}

export function assertTargetSizes(root: ParentNode = document) {
  const controls = [...root.querySelectorAll<HTMLElement>('a[href], button, input, textarea, select, summary, ui-checkbox, ui-radio, ui-switch, ui-select-item')];
  const failures = controls.flatMap(el => {
    if (el.matches(':disabled') || el.closest('[hidden], [aria-hidden="true"]')) return [];
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return [];
    const fileTrigger = el.matches('input[type="file"][tabindex="-1"]')
      ? el.closest('ui-file-input')?.querySelector('ui-file-input-trigger button')
      : null;
    const target = fileTrigger ?? el.closest('label') ?? el.closest('ui-slider-thumb') ?? el;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return [];
    return rect.width < 43.99 || rect.height < 43.99
      ? [{ tag: el.tagName, name: el.getAttribute('aria-label') || el.textContent?.trim(), width: rect.width, height: rect.height }]
      : [];
  });
  expect(failures, 'Author-controlled targets must be at least 44×44 CSS pixels').toEqual([]);
}

export function assertLandmarks() {
  const headers = [...document.querySelectorAll('header')];
  const mains = [...document.querySelectorAll('main')];
  const footers = [...document.querySelectorAll('footer')];
  expect(headers).toHaveLength(1);
  expect(mains).toHaveLength(1);
  expect(footers).toHaveLength(1);
  expect(mains[0].contains(footers[0])).toBe(false);
  expect(mains[0].contains(headers[0])).toBe(false);

  const navs = [...document.querySelectorAll('nav')];
  expect(navs.length).toBeGreaterThan(0);
  for (const nav of navs) {
    const label = nav.getAttribute('aria-label')?.trim() || nav.getAttribute('aria-labelledby')?.trim();
    expect(label, 'Every <nav> landmark must have an accessible name').toBeTruthy();
  }
}

export function assertHeadingHierarchy() {
  const h1s = [...document.querySelectorAll('h1')];
  expect(h1s).toHaveLength(1);
  expect(h1s[0].textContent?.trim().length).toBeGreaterThan(0);

  const headings = [...document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')].filter(
    el => !el.closest('[hidden]') && getComputedStyle(el).display !== 'none',
  );
  let prevLevel = 0;
  for (const heading of headings) {
    expect(heading.textContent?.trim().length).toBeGreaterThan(0);
    const level = Number(heading.tagName[1]);
    if (prevLevel > 0) {
      expect(level, `Heading ${heading.tagName} ("${heading.textContent?.trim()}") skips a level after h${prevLevel}`).toBeLessThanOrEqual(prevLevel + 1);
    }
    prevLevel = level;
  }
}

export function assertUniqueIdsAndValidAriaRefs() {
  const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  expect(duplicates).toEqual([]);

  for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls'] as const) {
    for (const el of document.querySelectorAll<HTMLElement>(`[${attr}]`)) {
      if (el.closest('[hidden]')) continue;
      const refs = (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean);
      for (const ref of refs) {
        expect(document.getElementById(ref), `${el.tagName} ${attr}="${ref}" must point to an existing element`).not.toBeNull();
      }
    }
  }

  for (const label of document.querySelectorAll<HTMLLabelElement>('label[for]')) {
    const targetId = label.getAttribute('for');
    if (targetId) {
      expect(document.getElementById(targetId), `label[for="${targetId}"] must point to an existing element`).not.toBeNull();
    }
  }
}

export function injectTestStyle(css: string) {
  const style = document.createElement('style');
  style.dataset.testStyle = 'true';
  style.textContent = css;
  document.head.append(style);
  return style;
}

function resolveColorRgb(cssColor: string): [number, number, number, number] {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = cssColor;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a / 255];
}

export function effectiveBackground(el: Element): string {
  let current: Element | null = el;
  while (current) {
    const bg = getComputedStyle(current).backgroundColor;
    const [, , , alpha] = resolveColorRgb(bg);
    if (alpha > 0.95) return bg;
    current = current.parentElement;
  }
  return getComputedStyle(document.documentElement).backgroundColor;
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(cssColorA: string, cssColorB: string): number {
  const [r1, g1, b1] = resolveColorRgb(cssColorA);
  const [r2, g2, b2] = resolveColorRgb(cssColorB);
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export async function nextFrame() {
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}
