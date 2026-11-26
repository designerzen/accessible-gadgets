import { afterEach, describe, expect, it } from 'vitest';
import { commands, page, userEvent } from 'vitest/browser';
import indexHtml from '../index.html?raw';
import { renderApp } from '../src/app';
import { audio, pulse, valuePitch } from '../src/audio';
import { componentPages } from '../src/pages';
import { themes } from '../src/theme';
import {
  contrastRatio,
  effectiveBackground,
  injectTestStyle,
  mountPage,
  nextFrame,
  resetEnvironment,
  runAxe,
} from './vitest-helpers';

const componentHtmlFiles = import.meta.glob('../components/*/index.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

describe('Inclusion across sensory, visual, motor, directional, and platform needs', () => {
  let cleanup: (() => void) | undefined;

  afterEach(async () => {
    cleanup?.();
    cleanup = undefined;
    await resetEnvironment();
  });

  it('keeps sound opt-in, exposes volume percentage text and aria-valuetext, and validates valuePitch bounds', async () => {
    const mounted = mountPage('slider');
    cleanup = mounted.dispose;
    await nextFrame();

    const toggle = document.querySelector<HTMLButtonElement>('#sound-toggle')!;
    const volume = document.querySelector<HTMLInputElement>('#cue-volume')!;
    const readout = document.querySelector<HTMLElement>('.volume-readout')!;

    expect(audio.enabled).toBe(false);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(volume.getAttribute('aria-valuetext')).toBe('35%');
    expect(readout.textContent).toBe('35%');

    audio.setVolume(0.75);
    expect(volume.getAttribute('aria-valuetext')).toBe('75%');
    expect(readout.textContent).toBe('75%');

    expect(valuePitch(0, 0, 100)).toBe(-12);
    expect(valuePitch(50, 0, 100)).toBe(0);
    expect(valuePitch(100, 0, 100)).toBe(12);
    expect(valuePitch(Number.NaN, 0, 100)).toBe(0);
    expect(valuePitch(10, 10, 10)).toBe(0);
  });

  it('respects prefers-reduced-motion: reduce by disabling pulses and transitions', async () => {
    await commands.emulateMedia({ reducedMotion: 'reduce' });
    const mounted = mountPage('button');
    cleanup = mounted.dispose;
    await nextFrame();

    const host = document.querySelector<HTMLElement>('ag-button')!;
    pulse(host);
    expect(host.getAnimations().length).toBe(0);
    expect(parseFloat(getComputedStyle(host).transitionDuration)).toBeLessThanOrEqual(0.01);
  });

  it('maintains visible >= 3px focus indicators and state distinction under forced-colors and prefers-contrast: more', async () => {
    await commands.emulateMedia({ forcedColors: 'active', contrast: 'more' });
    const mounted = mountPage('slider');
    cleanup = mounted.dispose;
    await nextFrame();

    const range = document.querySelector<HTMLInputElement>('ag-slider input[type="range"]')!;
    const thumb = document.querySelector<HTMLElement>('ui-slider-thumb')!;
    range.focus();
    await userEvent.keyboard('{ArrowRight}');
    await nextFrame();

    const style = getComputedStyle(thumb);
    expect(style.outlineStyle).toBe('solid');
    expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(3);
  });

  it('delivers AAA (>= 7:1) text contrast and >= 3:1 control/thumb contrast across all 5 themes in light and dark modes', async () => {
    const mounted = mountPage('switch');
    cleanup = mounted.dispose;
    await nextFrame();

    const select = document.querySelector<HTMLSelectElement>('#theme-select')!;
    const heading = document.querySelector<HTMLElement>('h1')!;
    const description = document.querySelector<HTMLElement>('.page-description')!;
    const feedback = document.querySelector<HTMLElement>('[data-feedback]')!;
    const codeBlock = document.querySelector<HTMLElement>('pre.code-block')!;
    const sw = document.querySelector<HTMLElement>('ui-switch')!;
    const thumb = document.querySelector<HTMLElement>('ui-switch-thumb')!;

    for (const themeEntry of themes) {
      await userEvent.selectOptions(select, themeEntry.id);
      for (const mode of ['light', 'dark'] as const) {
        const modeButton = document.querySelector<HTMLButtonElement>(`.mode-group [data-color-mode="${mode}"]`)!;
        await userEvent.click(modeButton);
        await nextFrame();

        expect(document.documentElement.dataset.theme).toBe(themeEntry.id);
        expect(document.documentElement.dataset.colorMode).toBe(mode);
        expect(modeButton.getAttribute('aria-pressed')).toBe('true');

        await runAxe();

        for (const el of [heading, description, feedback, codeBlock]) {
          expect(
            contrastRatio(getComputedStyle(el).color, effectiveBackground(el)),
            `${themeEntry.id} (${mode}) text contrast on ${el.tagName}.${el.className}`,
          ).toBeGreaterThanOrEqual(7);
        }
        expect(
          contrastRatio(getComputedStyle(thumb).borderColor, getComputedStyle(sw).backgroundColor),
          `${themeEntry.id} (${mode}) switch thumb non-text contrast`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('respects OS prefers-color-scheme in system mode, lets explicit Light/Dark override OS, and persists across reloads', async () => {
    await commands.emulateMedia({ colorScheme: 'dark' });
    const mounted = mountPage('button');
    cleanup = mounted.dispose;
    await nextFrame();

    // Default System mode follows OS dark preference.
    const darkBg = getComputedStyle(document.documentElement).backgroundColor;
    expect(document.documentElement.dataset.colorMode).toBe('system');

    // Explicit Light overrides OS dark preference.
    await userEvent.click(document.querySelector<HTMLButtonElement>('.mode-group [data-color-mode="light"]')!);
    await nextFrame();
    const lightBg = getComputedStyle(document.documentElement).backgroundColor;
    expect(contrastRatio('rgb(0, 0, 0)', lightBg)).toBeGreaterThan(contrastRatio('rgb(0, 0, 0)', darkBg));

    // Selecting a theme persists with explicit Dark even under light OS preference.
    await commands.emulateMedia({ colorScheme: 'light' });
    await userEvent.selectOptions(document.querySelector<HTMLSelectElement>('#theme-select')!, 'ocean');
    await userEvent.click(document.querySelector<HTMLButtonElement>('.mode-group [data-color-mode="dark"]')!);
    await nextFrame();

    const remounted = renderApp(mounted.app, 'button');
    cleanup = remounted.dispose;
    await nextFrame();

    expect(document.documentElement.dataset.theme).toBe('ocean');
    expect(document.documentElement.dataset.colorMode).toBe('dark');
    expect(document.querySelector<HTMLSelectElement>('#theme-select')!.value).toBe('ocean');
    expect(document.querySelector<HTMLButtonElement>('.mode-group [data-color-mode="dark"]')!.getAttribute('aria-pressed')).toBe('true');

    // Copy button announces status without throwing in headless contexts.
    await userEvent.click(document.querySelector<HTMLButtonElement>('[data-copy-code]')!);
    await nextFrame();
    expect(document.querySelector('[data-copy-status]')!.textContent!.length).toBeGreaterThan(0);
  });

  it('supports RTL (dir="rtl") layout, switch thumb direction, and 320px reflow without overflow', async () => {
    const mounted = mountPage('switch');
    cleanup = mounted.dispose;
    document.documentElement.dir = 'rtl';
    await page.viewport(320, 900);
    injectTestStyle('* { line-height: 1.5 !important; }');
    await nextFrame();

    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320);

    const sw = document.querySelector<HTMLElement>('ui-switch')!;
    const thumb = document.querySelector<HTMLElement>('ui-switch-thumb')!;
    const uncheckedBox = thumb.getBoundingClientRect();

    sw.focus();
    await userEvent.keyboard(' ');
    await nextFrame();

    const switchBox = sw.getBoundingClientRect();
    const checkedBox = thumb.getBoundingClientRect();
    expect(checkedBox.left).toBeGreaterThanOrEqual(switchBox.left - 1);
    expect(checkedBox.right).toBeLessThanOrEqual(switchBox.right + 1);
    expect((checkedBox.left + checkedBox.right) / 2).toBeLessThan((uncheckedBox.left + uncheckedBox.right) / 2);
  });

  it('satisfies WCAG 2.5.3 Label in Name for all visible buttons and links', async () => {
    const mounted = mountPage();
    cleanup = mounted.dispose;
    await nextFrame();

    for (const el of document.querySelectorAll<HTMLElement>('button, a[href]')) {
      if (el.closest('[hidden]') || getComputedStyle(el).display === 'none') continue;
      const ariaLabel = el.getAttribute('aria-label')?.trim();
      if (!ariaLabel) continue;
      const visibleClone = el.cloneNode(true) as HTMLElement;
      visibleClone.querySelectorAll('[aria-hidden="true"], .sr-only').forEach(node => node.remove());
      const visibleText = visibleClone.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() || '';
      if (visibleText) {
        expect(ariaLabel.toLowerCase()).toContain(visibleText);
      }
    }
  });

  it('ensures static index.html and all 17 component HTML entry points declare lang, unrestricted viewport, skip link, and matching title', () => {
    expect(indexHtml).toMatch(/<html\s+lang="en"/i);
    expect(indexHtml).toMatch(/<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1"/i);
    expect(indexHtml).not.toMatch(/user-scalable\s*=\s*(no|0)|maximum-scale\s*=/i);
    expect(indexHtml).toContain('class="skip-link"');

    expect(Object.keys(componentHtmlFiles)).toHaveLength(componentPages.length);
    for (const component of componentPages) {
      const html = componentHtmlFiles[`../components/${component.slug}/index.html`];
      expect(html, `Missing static HTML entry for ${component.slug}`).toBeDefined();
      expect(html).toMatch(/<html\s+lang="en"/i);
      expect(html).toMatch(/<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1"/i);
      expect(html).not.toMatch(/user-scalable\s*=\s*(no|0)|maximum-scale\s*=/i);
      expect(html).toContain(`data-component="${component.slug}"`);
      expect(html).toContain('class="skip-link"');
      expect(html).toContain(`<title>${component.title} test — Accessible Gadgets</title>`);
    }
  });
});
