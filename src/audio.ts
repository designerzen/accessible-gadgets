import { ButtonSynth, type Profile } from './vendor/button-synth/synth';

// The upstream engine supplies synthesis, output protection and voice cleanup.
// This deliberately short tonal profile makes neighbouring values comparable.
export const tickProfile: Profile = {
  id: 'value-tick', name: 'Value tick', samples: 0,
  down: { notes: [{ frequency: 440, at: 0, duration: .035, wave: 'sine' }], modes: [], decay: .012, brightness: 2500, noise: 0, bounce: 0, level: .65 },
  up: { notes: [{ frequency: 440, at: 0, duration: .02, wave: 'sine' }], modes: [], decay: .012, brightness: 2500, noise: 0, bounce: 0, level: .4 },
};

export function valuePitch(value: number, min: number, max: number): number {
  if (![value, min, max].every(Number.isFinite) || max <= min) return 0;
  return -12 + Math.max(0, Math.min(1, (value - min) / (max - min))) * 24;
}

type Cue = 'tick' | 'press' | 'on' | 'off' | 'select' | 'success' | 'error' | 'focus';
const presets: Record<Exclude<Cue, 'tick'>, string> = {
  press: 'hi75-soft', on: 'game-pixel-toggle', off: 'game-pixel-toggle',
  select: 'game-8bit-select', success: 'game-console-confirm', error: 'game-menu-error', focus: 'game-pause-blip',
};

class FeedbackAudio extends EventTarget {
  private synth?: ButtonSynth;
  enabled = false;
  volume = .35;
  unavailable = false;

  constructor() {
    super();
    try {
      this.enabled = localStorage.getItem('ag-sound') === 'on';
      const volume = Number(localStorage.getItem('ag-volume') ?? .35);
      if (Number.isFinite(volume)) this.volume = Math.max(0, Math.min(1, volume));
    } catch { /* Storage is optional. */ }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.synth?.setMuted(!enabled);
    try { localStorage.setItem('ag-sound', enabled ? 'on' : 'off'); } catch { /* Optional. */ }
    this.dispatchEvent(new Event('settingschange'));
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    try { localStorage.setItem('ag-volume', String(this.volume)); } catch { /* Optional. */ }
    this.dispatchEvent(new Event('settingschange'));
  }

  async play(cue: Cue, pitch = 0): Promise<void> {
    if (!this.enabled || this.volume === 0) return;
    try {
      this.synth ??= new ButtonSynth();
      await this.synth.trigger(cue === 'tick' ? tickProfile : presets[cue], cue === 'off' ? 'up' : 'down', {
        pitch, volume: this.volume * (cue === 'focus' ? .25 : 1),
        variation: 0, decay: cue === 'tick' ? .6 : .55, bounce: 0,
      }, 42);
      if (this.unavailable) { this.unavailable = false; this.dispatchEvent(new Event('settingschange')); }
    } catch {
      this.unavailable = true;
      this.dispatchEvent(new Event('settingschange'));
    }
  }

  async dispose() { await this.synth?.dispose(); this.synth = undefined; }
}

export const audio = new FeedbackAudio();
window.addEventListener('pagehide', () => { void audio.dispose(); });

export function pulse(element: HTMLElement) {
  if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof element.getAnimations === 'function') {
    element.getAnimations().forEach(animation => animation.cancel());
  }
  if (typeof element.animate !== 'function') return;
  const style = getComputedStyle(element);
  const ring = style.getPropertyValue('--ag-feedback-ring').trim()
    || `color-mix(in oklch, ${style.getPropertyValue('--ag-accent').trim() || 'currentColor'} 45%, transparent)`;
  element.animate([
    { outline: `3px solid ${ring || 'currentColor'}`, outlineOffset: '4px' },
    { outline: '3px solid transparent', outlineOffset: '9px' },
  ], { duration: 280, easing: 'ease-out' });
}
