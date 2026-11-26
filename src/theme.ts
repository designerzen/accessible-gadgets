export const themes = [
  { id: 'monochrome', label: 'Monochrome', lightBg: '#fafafa', darkBg: '#121212' },
  { id: 'ocean', label: 'Ocean Blue', lightBg: '#f4f8fc', darkBg: '#0c1824' },
  { id: 'forest', label: 'Forest Green', lightBg: '#f4f9f6', darkBg: '#0c1a13' },
  { id: 'paper', label: 'Warm Paper', lightBg: '#f8f4ee', darkBg: '#1c1814' },
  { id: 'high-contrast', label: 'High Contrast', lightBg: '#ffffff', darkBg: '#000000' },
] as const;

export const colorModes = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
export type ColorMode = (typeof colorModes)[number]['id'];

const THEME_STORAGE_KEY = 'ag-theme';
const MODE_STORAGE_KEY = 'ag-color-mode';

function isThemeId(value: string | null): value is ThemeId {
  return themes.some(entry => entry.id === value);
}

function isColorMode(value: string | null): value is ColorMode {
  return colorModes.some(entry => entry.id === value);
}

function readStorage(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors in restricted contexts.
  }
}

function removeStorage(key: string) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch {
    // Ignore storage errors in restricted contexts.
  }
}

export class ThemeManager {
  #mediaListening = false;

  get themeId(): ThemeId {
    const stored = readStorage(THEME_STORAGE_KEY);
    return isThemeId(stored) ? stored : 'monochrome';
  }

  get colorMode(): ColorMode {
    const stored = readStorage(MODE_STORAGE_KEY);
    return isColorMode(stored) ? stored : 'system';
  }

  get resolvedColorMode(): 'light' | 'dark' {
    const mode = this.colorMode;
    if (mode !== 'system') return mode;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  setTheme(id: ThemeId) {
    if (!isThemeId(id)) return;
    writeStorage(THEME_STORAGE_KEY, id);
    this.apply();
  }

  setColorMode(mode: ColorMode) {
    if (!isColorMode(mode)) return;
    writeStorage(MODE_STORAGE_KEY, mode);
    this.apply();
  }

  apply() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const activeTheme = this.themeId;
    const activeMode = this.colorMode;
    root.dataset.theme = activeTheme;
    root.dataset.colorMode = activeMode;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      const entry = themes.find(item => item.id === activeTheme) ?? themes[0];
      meta.content = this.resolvedColorMode === 'dark' ? entry.darkBg : entry.lightBg;
    }

    if (!this.#mediaListening && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.#mediaListening = true;
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.colorMode === 'system') this.apply();
      });
    }
  }

  reset() {
    removeStorage(THEME_STORAGE_KEY);
    removeStorage(MODE_STORAGE_KEY);
    this.apply();
  }
}

export const theme = new ThemeManager();
theme.apply();
