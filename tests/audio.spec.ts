import { expect, test } from '@playwright/test';

test('button-synth renders bounded tones whose frequency follows slider value', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    // @ts-expect-error Vite resolves browser source imports.
    const { renderSound, defaults } = await import('/src/vendor/button-synth/synth.ts');
    // @ts-expect-error Vite resolves browser source imports.
    const { tickProfile, valuePitch } = await import('/src/audio.ts');
    const measurements = [];
    for (const value of [0, 50, 100]) {
      const buffer: AudioBuffer = await renderSound(tickProfile, 'down', { ...defaults, volume: .35, decay: .6, variation: 0, pitch: valuePitch(value, 0, 100) });
      const data = buffer.getChannelData(0);
      const crossings = [];
      let energy = 0, peak = 0;
      for (let i = 1; i < data.length; i++) {
        peak = Math.max(peak, Math.abs(data[i]));
        energy += data[i] * data[i];
        if (i > buffer.sampleRate * .005 && i < buffer.sampleRate * .025 && data[i - 1] < 0 && data[i] >= 0) crossings.push(i);
      }
      const frequency = (crossings.length - 1) * buffer.sampleRate / (crossings.at(-1)! - crossings[0]);
      measurements.push({ frequency, energy, peak });
    }
    return measurements;
  });
  for (const [index, expected] of [220, 440, 880].entries()) {
    expect(result[index].frequency).toBeCloseTo(expected, -1);
    expect(result[index].energy).toBeGreaterThan(.001);
    expect(result[index].peak).toBeLessThan(1);
  }
});

test('sound is opt-in, persists, mutes immediately, and live cues use Web Audio', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Sound cues', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => {
    (window as any).oscillatorCount = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function () {
      (window as any).oscillatorCount++;
      return original.call(this);
    };
  });
  await page.getByRole('button', { name: 'Increase intensity' }).click();
  expect(await page.evaluate(() => (window as any).oscillatorCount)).toBe(0);
  await toggle.click();
  await expect.poll(() => page.evaluate(() => (window as any).oscillatorCount)).toBeGreaterThan(0);
  const before = await page.evaluate(() => (window as any).oscillatorCount);
  await page.getByRole('button', { name: 'Increase intensity' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).oscillatorCount)).toBeGreaterThan(before);
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  expect(await page.evaluate(() => localStorage.getItem('ag-sound'))).toBe('off');
});
