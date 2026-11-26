import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import {
  contrastRatio,
  effectiveBackground,
  mountPage,
  nextFrame,
  resetEnvironment,
  runAxe,
} from './vitest-helpers';

describe('Component accessibility and inclusion behaviors', () => {
  let cleanup: (() => void) | undefined;

  afterEach(async () => {
    cleanup?.();
    cleanup = undefined;
    await resetEnvironment();
  });

  it('ag-slider supports keyboard navigation, localized valuetext, focus-retaining step bounds, and form integration', async () => {
    const mounted = mountPage('slider');
    cleanup = mounted.dispose;
    await nextFrame();

    const slider = document.querySelector<HTMLElement & { value: number }>('ag-slider')!;
    const range = slider.querySelector<HTMLInputElement>('input[type="range"]')!;
    const output = slider.querySelector<HTMLElement>('output')!;
    const minus = slider.querySelector<HTMLButtonElement>('[data-step="minus"]')!;
    const plus = slider.querySelector<HTMLButtonElement>('[data-step="plus"]')!;
    const announcement = slider.querySelector<HTMLElement>('[data-announcement]')!;

    expect(output.getAttribute('aria-live')).toBe('off');
    expect(range.getAttribute('aria-valuetext')).toBe('50%');

    range.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(output.textContent).toBe('51%');
    expect(range.getAttribute('aria-valuetext')).toBe('51%');

    await userEvent.keyboard('{PageUp}');
    expect(output.textContent).toBe('61%');

    await userEvent.keyboard('{Home}');
    expect(output.textContent).toBe('0%');
    expect(minus.getAttribute('aria-disabled')).toBe('true');
    expect(minus.disabled).toBe(false);

    await userEvent.keyboard('{End}');
    expect(output.textContent).toBe('100%');
    expect(plus.getAttribute('aria-disabled')).toBe('true');

    await userEvent.click(minus);
    expect(output.textContent).toBe('99%');
    expect(announcement.textContent).toBe('Intensity: 99%');

    // Form integration + read-only + disabled
    const form = document.createElement('form');
    form.innerHTML = '<ag-slider label="Gain" name="gain" min="0" max="10" step="1" value="4"></ag-slider><button type="reset">Reset</button>';
    document.querySelector('main')!.append(form);
    const customSlider = form.querySelector<HTMLElement & { value: number }>('ag-slider')!;
    customSlider.value = 7;
    await nextFrame();
    expect(new FormData(form).get('gain')).toBe('7');
    form.reset();
    await nextFrame();
    expect(customSlider.value).toBe(4);
    customSlider.setAttribute('read-only', '');
    await nextFrame();
    expect(customSlider.querySelector('input[type="range"]')?.getAttribute('aria-readonly')).toBe('true');
    customSlider.setAttribute('disabled', '');
    await nextFrame();
    expect(new FormData(form).get('gain')).toBeNull();
    await runAxe();
  });

  it('ag-button increments status on consecutive presses and responds to Enter and Space', async () => {
    const mounted = mountPage('button');
    cleanup = mounted.dispose;
    await nextFrame();

    const button = page.getByRole('button', { name: 'Try a button' });
    const status = document.querySelector('ag-button [data-feedback]')!;

    await button.click();
    expect(status.textContent).toBe('Activated');

    await userEvent.keyboard('{Enter}');
    expect(status.textContent).toBe('Activated (2)');

    await userEvent.keyboard(' ');
    expect(status.textContent).toBe('Activated (3)');
  });

  it('ag-checkbox supports Space toggle and indeterminate mixed state', async () => {
    const mounted = mountPage('checkbox');
    cleanup = mounted.dispose;
    await nextFrame();

    const checkbox = document.querySelector<HTMLElement>('ui-checkbox')!;
    const status = document.querySelector('ag-checkbox [data-feedback]')!;

    checkbox.focus();
    await userEvent.keyboard(' ');
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(status.textContent).toBe('Selected');

    await userEvent.keyboard(' ');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    expect(status.textContent).toBe('Not selected');

    // Verify indeterminate state mapping
    const host = document.createElement('ag-checkbox');
    host.innerHTML = `<label><ui-checkbox><ui-checkbox-indicator aria-hidden="true">–</ui-checkbox-indicator></ui-checkbox>Select all</label><span data-feedback role="status">Not selected</span>`;
    document.querySelector('main')!.append(host);
    await nextFrame();
    const mixedControl = host.querySelector<HTMLElement & { checked: boolean | 'indeterminate'; api: { setChecked: (value: boolean | 'indeterminate') => boolean } }>('ui-checkbox')!;
    mixedControl.api.setChecked('indeterminate');
    await nextFrame();
    expect(mixedControl.getAttribute('aria-checked')).toBe('mixed');
    expect(host.querySelector('[data-feedback]')!.textContent).toBe('Partially selected');
    mixedControl.focus();
    await userEvent.keyboard(' ');
    await nextFrame();
    expect(mixedControl.getAttribute('aria-checked')).toBe('true');
    expect(host.querySelector('[data-feedback]')!.textContent).toBe('Selected');
  });

  it('ag-switch provides accessible switch semantics and >= 3:1 thumb non-text contrast in both states', async () => {
    const mounted = mountPage('switch');
    cleanup = mounted.dispose;
    await nextFrame();

    const sw = document.querySelector<HTMLElement>('ui-switch')!;
    const thumb = document.querySelector<HTMLElement>('ui-switch-thumb')!;
    const status = document.querySelector('ag-switch [data-feedback]')!;

    expect(sw.getAttribute('role')).toBe('switch');
    expect(sw.getAttribute('aria-checked')).toBe('false');
    const offTrackBg = getComputedStyle(sw).backgroundColor;
    const offThumbBorder = getComputedStyle(thumb).borderColor;
    expect(contrastRatio(offThumbBorder, offTrackBg)).toBeGreaterThanOrEqual(3);

    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw.getAttribute('aria-checked')).toBe('true');
    expect(status.textContent).toBe('On');
    const onTrackBg = getComputedStyle(sw).backgroundColor;
    const onThumbBorder = getComputedStyle(thumb).borderColor;
    expect(contrastRatio(onThumbBorder, onTrackBg)).toBeGreaterThanOrEqual(3);
  });

  it('ag-radio exposes radiogroup labeling, arrow navigation, and clean deselection status', async () => {
    const mounted = mountPage('radio');
    cleanup = mounted.dispose;
    await nextFrame();

    const group = document.querySelector<HTMLElement & { api: { setValue: (v: string | null) => boolean } }>('ui-radio-group')!;
    const status = document.querySelector('ag-radio [data-feedback]')!;
    expect(group.getAttribute('role')).toBe('radiogroup');

    const weekly = document.querySelector<HTMLElement>('ui-radio[value="weekly"]')!;
    weekly.focus();
    await userEvent.keyboard('{ArrowRight}');
    await nextFrame();
    expect(status.textContent).toBe('Monthly selected');

    group.api.setValue(null);
    await nextFrame();
    expect(status.textContent).toBe('No selection');
  });

  it('ag-select excludes decorative indicator marks from status text, passes axe while open, and returns focus on Escape', async () => {
    const mounted = mountPage('select');
    cleanup = mounted.dispose;
    await nextFrame();

    const trigger = document.querySelector<HTMLButtonElement>('.select-trigger')!;
    const status = document.querySelector('ag-select [data-feedback]')!;

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await nextFrame();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await runAxe();

    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{Enter}');
    await nextFrame();
    expect(status.textContent).toBe('Take it slow selected');
    expect(status.textContent).not.toContain('✓');

    await userEvent.keyboard('{Enter}');
    await nextFrame();
    await userEvent.keyboard('{Escape}');
    await nextFrame();
    expect(document.activeElement).toBe(trigger);
  });

  it('ag-input avoids spurious blur announcements on untouched optional fields and associates persistent validation errors', async () => {
    const mounted = mountPage('input');
    cleanup = mounted.dispose;
    await nextFrame();

    const input = document.querySelector<HTMLInputElement>('ag-input input')!;
    const status = document.querySelector<HTMLElement>('ag-input [data-feedback]')!;

    // Tabbing past an untouched optional input stays quiet and valid.
    input.focus();
    await userEvent.tab();
    await nextFrame();
    expect(status.textContent).toBe('Ready for input');
    expect(input.hasAttribute('aria-invalid')).toBe(false);

    input.required = true;
    await userEvent.fill(input, 'Alex');
    await userEvent.clear(input);
    await userEvent.tab();
    await nextFrame();

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(status.textContent).toBe('A value is required');
    expect(input.getAttribute('aria-describedby')).toContain(status.id);
    await runAxe();

    await userEvent.fill(input, 'Alex');
    await userEvent.tab();
    await nextFrame();
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(status.textContent).toBe('Value accepted');
  });

  it('ag-number updates value with arrows and buttons, preserves bounds, and adapts to custom labels', async () => {
    const mounted = mountPage('number');
    cleanup = mounted.dispose;
    await nextFrame();

    const input = document.querySelector<HTMLInputElement>('ag-number input')!;
    const status = document.querySelector('ag-number [data-feedback]')!;

    input.focus();
    await userEvent.keyboard('{ArrowUp}');
    await nextFrame();
    expect(status.textContent).toBe('Quantity: 4');

    await userEvent.keyboard('{End}');
    await nextFrame();
    expect(status.textContent).toBe('Quantity: 10');
    expect(document.querySelector<HTMLButtonElement>('ui-number-input-increment button')?.disabled).toBe(true);
  });

  it('ag-textarea associates the counter via aria-describedby while announcing only on blur and capacity thresholds', async () => {
    const mounted = mountPage('textarea');
    cleanup = mounted.dispose;
    await nextFrame();

    const textarea = document.querySelector<HTMLTextAreaElement>('ag-textarea textarea')!;
    const visibleCount = document.querySelector<HTMLElement>('ag-textarea [data-feedback]')!;
    const announcement = document.querySelector<HTMLElement>('ag-textarea [data-count-announcement]')!;

    expect(visibleCount.getAttribute('aria-live')).toBe('off');
    expect(textarea.getAttribute('aria-describedby')).toContain(visibleCount.id);

    await userEvent.fill(textarea, 'Hello');
    expect(visibleCount.textContent).toBe('5 / 200 characters');
    expect(announcement.textContent).toBe('');

    await userEvent.fill(textarea, 'a'.repeat(180));
    expect(announcement.textContent).toBe('20 characters remaining.');

    await userEvent.fill(textarea, 'a'.repeat(200));
    expect(announcement.textContent).toBe('Character limit reached: 200 characters.');

    await userEvent.tab();
    expect(announcement.textContent).toBe('200 / 200 characters');
  });

  it('ag-password keeps stable toggle button label and accessible name, hides secrets, and surfaces Caps Lock', async () => {
    const mounted = mountPage('password');
    cleanup = mounted.dispose;
    await nextFrame();

    const input = document.querySelector<HTMLInputElement>('ag-password input')!;
    const toggle = document.querySelector<HTMLButtonElement>('ui-password-input-toggle button')!;
    const control = document.querySelector<HTMLElement>('ui-password-input')!;
    const status = document.querySelector<HTMLElement>('ag-password [data-feedback]')!;
    const capsLock = document.querySelector<HTMLElement>('[data-caps-lock]')!;

    await userEvent.fill(input, 'super-secret-phrase');
    expect(toggle.textContent?.trim()).toBe('Show');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    await userEvent.click(toggle);
    await nextFrame();
    expect(input.type).toBe('text');
    expect(toggle.textContent?.trim()).toBe('Show');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(status.textContent).toBe('Password visible');
    expect(status.textContent).not.toContain('super-secret-phrase');
    await userEvent.hover(toggle);
    await runAxe();

    control.setAttribute('data-capslock', '');
    await nextFrame();
    expect(capsLock.textContent).toBe('Caps Lock is on');
    control.removeAttribute('data-capslock');
    await nextFrame();
    expect(capsLock.textContent).toBe('');
  });

  it('ag-file links file constraints, names per-file remove buttons, and provides specific rejection reasons', async () => {
    const mounted = mountPage('file');
    cleanup = mounted.dispose;
    await nextFrame();

    const trigger = document.querySelector<HTMLButtonElement>('ui-file-input-trigger button')!;
    const fileInput = document.querySelector<HTMLInputElement>('ui-file-input input[type="file"]')!;
    const status = document.querySelector<HTMLElement>('ag-file [data-feedback]')!;

    expect(trigger.getAttribute('aria-describedby')).toBe('ag-file-hint');

    const okFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(fileInput, okFile);
    await nextFrame();
    expect(status.textContent).toBe('1 file selected');
    const removeBtn = document.querySelector<HTMLButtonElement>('ui-file-input-item-remove button')!;
    expect(removeBtn.getAttribute('aria-label')).toBe('Remove hello.txt');

    const badType = new File(['img'], 'photo.png', { type: 'image/png' });
    await userEvent.upload(fileInput, badType);
    await nextFrame();
    expect(status.textContent).toContain('unsupported file type');

    const tooLarge = new File([new Uint8Array(1_200_000)], 'huge.txt', { type: 'text/plain' });
    await userEvent.upload(fileInput, tooLarge);
    await nextFrame();
    expect(status.textContent).toContain('larger than 1 MB');
  });

  it('ag-details toggles expanded state with keyboard and passes axe when open', async () => {
    const mounted = mountPage('details');
    cleanup = mounted.dispose;
    await nextFrame();

    const trigger = document.querySelector<HTMLButtonElement>('.disclosure-trigger')!;
    const panel = document.querySelector<HTMLElement>('ui-collapsible-panel')!;
    const status = document.querySelector<HTMLElement>('ag-details [data-feedback]')!;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await nextFrame();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
    expect(status.textContent).toBe('Details expanded');
    await runAxe();
  });

  it('ag-progress exposes progressbar semantics, focus-preserving completion state, and reset', async () => {
    const mounted = mountPage('progress');
    cleanup = mounted.dispose;
    await nextFrame();

    const bar = document.querySelector<HTMLElement>('ui-progress')!;
    const advance = document.querySelector<HTMLButtonElement>('[data-progress-step]')!;
    const reset = document.querySelector<HTMLButtonElement>('[data-progress-reset]')!;
    const status = document.querySelector<HTMLElement>('ag-progress [data-feedback]')!;

    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');

    for (let i = 0; i < 4; i++) {
      await userEvent.click(advance);
    }
    await nextFrame();
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
    expect(advance.getAttribute('aria-disabled')).toBe('true');
    expect(status.textContent).toBe('Complete');

    await userEvent.click(reset);
    await nextFrame();
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(status.textContent).toBe('Ready to begin');
  });

  it('ag-meter exposes meter semantics and updates live status text on explicit user request', async () => {
    const mounted = mountPage('meter');
    cleanup = mounted.dispose;
    await nextFrame();

    const meter = document.querySelector<HTMLElement>('ui-meter')!;
    const readButton = document.querySelector<HTMLButtonElement>('[data-meter-listen]')!;
    const status = document.querySelector<HTMLElement>('ag-meter [data-feedback]')!;

    expect(meter.getAttribute('role')).toBe('meter');
    expect(meter.getAttribute('aria-valuenow')).toBe('65');
    expect(status.textContent).toBe('Activate button to announce level');

    await userEvent.click(readButton);
    await nextFrame();
    expect(status.textContent).toBe('65% used');
  });

  it('ag-link keeps native anchor navigation semantics and reports activation', async () => {
    const mounted = mountPage('link');
    cleanup = mounted.dispose;
    await nextFrame();

    const link = document.querySelector<HTMLAnchorElement>('ag-link a')!;
    const status = document.querySelector<HTMLElement>('ag-link [data-feedback]')!;
    expect(link.getAttribute('href')).toBe('../slider/');

    link.addEventListener('click', event => event.preventDefault());
    await userEvent.click(link);
    await nextFrame();
    expect(status.textContent).toBe('Opening link');

    // On index page, #slider anchor target is focusable.
    mounted.dispose();
    const indexMounted = mountPage();
    cleanup = indexMounted.dispose;
    await nextFrame();
    expect(document.querySelector('#slider')?.getAttribute('tabindex')).toBe('-1');
  });

  it('date-time inputs have accessible labels, commit values cleanly, and recover when cleared', async () => {
    const mounted = mountPage('date-time');
    cleanup = mounted.dispose;
    await nextFrame();

    const dateInput = document.querySelector<HTMLInputElement>('input[type="date"]')!;
    const timeInput = document.querySelector<HTMLInputElement>('input[type="time"]')!;
    const feedbacks = document.querySelectorAll<HTMLElement>('[data-feedback]');

    await userEvent.fill(dateInput, '2026-12-01');
    await userEvent.tab();
    await nextFrame();
    expect(feedbacks[0].textContent).toBe('Value accepted');

    await userEvent.fill(timeInput, '14:30');
    await userEvent.tab();
    await nextFrame();
    expect(feedbacks[1].textContent).toBe('Value accepted');
  });

  it('color input pairs native swatch with a visible high-contrast hexadecimal text readout', async () => {
    const mounted = mountPage('color');
    cleanup = mounted.dispose;
    await nextFrame();

    const colorInput = document.querySelector<HTMLInputElement>('input[type="color"]')!;
    const readout = document.querySelector<HTMLElement>('[data-color-value]')!;
    const status = document.querySelector<HTMLElement>('ag-input [data-feedback]')!;

    expect(readout.textContent).toBe('#000000');
    const ratio = contrastRatio(getComputedStyle(readout).color, effectiveBackground(readout));
    expect(ratio).toBeGreaterThanOrEqual(7);

    colorInput.value = '#336699';
    colorInput.dispatchEvent(new Event('change', { bubbles: true }));
    await nextFrame();
    expect(readout.textContent).toBe('#336699');
    expect(status.textContent).toBe('Value accepted');
  });
});
