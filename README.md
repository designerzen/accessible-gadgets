# Accessible Gadgets

Classic interactive HTML controls enhanced with **UI SDK Web Components** and procedural **button-synth Web Audio** feedback. A pnpm + TypeScript + Vite project, with no React dependency.

## Run

```sh
pnpm install
pnpm dev
```

```sh
pnpm build        # Type-check and generate dist/
pnpm test         # Vitest accessibility/inclusion suite + Playwright Chromium E2E suite
pnpm test:vitest  # Vitest browser accessibility and inclusion tests across all 18 pages
pnpm test:e2e     # Chromium integration, audio rendering and accessibility checks
pnpm test:ios     # After building: iPhone/iPad WebKit emulation and enhanced checks
```

For a fresh Playwright installation, run `pnpm exec playwright install chromium webkit` once. Tests start their own server; the iPhone/iPad suite tests the built output on port 5199. Device emulation does not replace actual iOS Safari or VoiceOver testing.

## Live test pages and GitHub Pages

The root index links to every test page and also contains all live examples with collapsible code snippets. Dedicated pages live under `components/<name>/`, with one live example, technical specs and copy-ready code under **Usage & code**, a manual testing checklist, reset, an **Accessibility & inclusion considerations** breakdown below the primary component information, and previous/index/next navigation. There are 17 pages, including date/time and color variants of the input component. For example, open `/components/slider/` while running `pnpm dev`.

`pnpm build` emits the index and every component's `index.html` into `dist/`. Relative asset URLs and navigation support deployment under `/accessible-gadgets/` as well as a root domain. `pnpm test:built` tests the production output under the repository subpath after building, including links, direct reloads, interactions and automated accessibility checks on every page.

`.github/workflows/pages.yml` installs dependencies with the pinned pnpm version and frozen lockfile, runs the interaction/audio/accessibility tests, builds all pages, and tests the built output in Chromium and iPhone/iPad WebKit emulation. Pull requests run checks; successful pushes to `main` and manual runs on `main` also deploy the `dist/` artifact to GitHub Pages. Successful and failed runs upload separate test reports for inspection.

To enable the first deployment, select **Settings → Pages → Build and deployment → Source → GitHub Actions** in the repository. After the workflow succeeds, the index will be at `https://designerzen.github.io/accessible-gadgets/` and the slider at `https://designerzen.github.io/accessible-gadgets/components/slider/`.

## Components

The collection includes 17 examples across 15 reusable custom elements. Each component has its own source file and imports only its relevant UI SDK entry. UI SDK ships these entries in the shared `@ui-sdk/web` package; `@ui-sdk/core` is its peer dependency. Both are installed through pnpm and pinned by the lockfile.

| Custom element | Underlying control | Feedback |
| --- | --- | --- |
| `ag-slider` | `ui-slider` / native range input | Live value, ± buttons, pitch proportional to value |
| `ag-button` | `ui-button` / native button | Activation status and soft click |
| `ag-checkbox` | `ui-checkbox` | Visible check and different on/off cues |
| `ag-switch` | `ui-switch` | Visible state and different on/off cues |
| `ag-radio` | `ui-radio-group` | Selection status and pitch by option position |
| `ag-select` | `ui-select` | Selection status and pitch by option position |
| `ag-input` | `ui-input` / native input | Validation status and accepted/error cues on commitment |
| `ag-number` | `ui-number-input` | Live number and pitch by value |
| `ag-textarea` | `ui-textarea` / native textarea | Live character count, new-line and capacity cues |
| `ag-password` | `ui-password-input` | Show/hide status and distinct cues |
| `ag-file` | `ui-file-input` | Accepted/rejected/removed status and cues |
| `ag-details` | `ui-collapsible` | Expanded/collapsed status and cues |
| `ag-progress` | `ui-progress` | Percentage and explicit progress/completion cue |
| `ag-meter` | `ui-meter` | Measurement and explicit level cue |
| `ag-link` | Native anchor | Focus and activation feedback |

`ag-input` supports native input types, including text, email, search, URL, telephone, date, time, and color. Date/time and color have separate examples. Static HTML elements such as paragraphs, headings and images retain their usual semantics and do not make sounds.

## Themes and color modes

Every page and widget uses the shared OKLCH custom properties in [`src/theme.css`](./src/theme.css) managed by [`src/theme.ts`](./src/theme.ts). Five built-in themes (**Monochrome**, **Ocean Blue**, **Forest Green**, **Warm Paper**, and **High Contrast**) and three color modes (**System**, **Light**, and **Dark**) can be switched directly from the preferences bar and persist in `localStorage` (`ag-theme`, `ag-color-mode`). Each theme is calibrated for WCAG 2.2 AAA (`>= 7:1`) text contrast and `>= 3:1` control boundary contrast in both light and dark modes.

Override tokens after importing the stylesheet, either globally or on a widget's ancestor. Derived hover, soft-background, focus and feedback-ring colors follow the accent automatically through OKLCH color mixing.

```css
:root {
  --ag-accent: oklch(42% 0.15 265);
  --ag-on-accent: oklch(100% 0 0);
  --ag-radius-control: 3px;
  --ag-radius-card: 6px;
  --ag-target-size: 48px;
}

/* Optional local theme, inherited only by this example. */
ag-slider {
  --ag-accent: oklch(40% 0.12 150);
}
```

Palette tokens are `--ag-background`, `--ag-surface`, `--ag-surface-muted`, `--ag-text`, `--ag-text-muted`, `--ag-border`, `--ag-control-border`, `--ag-track`, `--ag-accent`, `--ag-on-accent`, `--ag-accent-hover`, `--ag-accent-soft`, `--ag-focus`, `--ag-feedback-ring`, `--ag-error`, and `--ag-shadow`. Shape, sizing and typography tokens include `--ag-radius-*`, `--ag-target-size`, `--ag-step-size`, `--ag-focus-width`, `--ag-focus-offset`, and `--ag-font-*`.

Native browser pickers and forced-color mode retain the user's platform colors. The color-input example starts with a black swatch; its value is example data rather than a theme setting. Choose accent/on-accent combinations with sufficient contrast when customizing.

## Use the slider

Import the component and the demo theme (or supply your own CSS for its light-DOM parts):

```ts
import './src/components/slider';
import './src/style.css';
```

```html
<form id="settings">
  <ag-slider
    label="Intensity"
    name="intensity"
    min="0"
    max="100"
    step="1"
    value="50"
    unit="%"
  ></ag-slider>
  <button type="reset">Reset</button>
</form>
```

- `value` is the initial value and reset target. Set the **`.value` property** for subsequent changes; UI SDK clamps and snaps it.
- `min`, `max`, `step`, `label`, `unit`, `name`, `form`, `disabled`, and `read-only` can be changed as attributes.
- `name` and `form` pass through to UI SDK's form-associated slider. `new FormData(form)` includes its numeric value. Form reset restores the initial value. Disabled controls are excluded.
- `.value` reads the current number. Listen to standard bubbling `input` events for live updates and `change` events for committed interactions.
- Minus/plus move one step and retain focus at the limits. They announce the resulting value through a polite live region. The range input supplies its own screen reader value announcements.
- Arrow keys move one step; Page Up / Down and Shift + arrows move larger steps; Home / End select the limits. Pointer and touch drag use UI SDK behavior.
- Each changed value triggers one short tonal tick. Pitch maps continuously from −12 to +12 semitones: **220 Hz → 440 Hz → 880 Hz** across the range. Rapid pointer movement can skip numerical steps, so cues represent the values actually reported by the slider rather than queuing stale intermediate ticks.

```ts
const slider = document.querySelector('ag-slider')!;
slider.value = 75;
slider.addEventListener('input', () => console.log(slider.value));
```

## Compose the other widgets

Each remaining wrapper enhances the UI SDK markup supplied inside it. This keeps labels, form names, defaults, constraints, disabled states, and event cancellation under the application's control. Put options on the underlying UI SDK element or native input according to its docs.

```ts
import './src/components/checkbox';
import { audio } from './src/audio';

// Call from an explicit user interaction, such as a sound preference button.
soundButton.addEventListener('click', () => {
  audio.setEnabled(!audio.enabled);
  if (audio.enabled) void audio.play('success');
});
```

```html
<ag-checkbox>
  <label class="choice-label">
    <ui-checkbox name="updates">
      <ui-checkbox-indicator aria-hidden="true">✓</ui-checkbox-indicator>
    </ui-checkbox>
    Keep me in the loop
  </label>
  <span data-feedback role="status">Not selected</span>
</ag-checkbox>
```

`data-feedback` identifies the element where the wrapper writes visible status text. A wrapper emits a bubbling `feedback` event with `{ text }` in its detail. UI SDK events remain available on their original elements. See `src/collection.ts` for a complete composition example for every control. All components can also be registered with `import './src/components/index'`.

Progress and meter updates are silent by default. After an explicit user request, dispatch `new Event('announce')` on `ag-progress` or `ag-meter` to report the current value visually and audibly. The demo uses a step button for progress and a read button for the meter; it does not start a background task or upload any files.

## Sound preferences and accessibility

The target is WCAG 2.2 AA plus selected AAA criteria and Apple's iOS/iPadOS accessibility guidance. Enhanced checks cover 44px targets, text contrast, focus, reduced motion and mobile text scaling. See [the accessibility testing record](./ACCESSIBILITY.md) for the exact scope and the unverified real-device acceptance checklist. CI fails on automated violations; a green build is not a certification of full accessibility or full AAA conformance.

- Sound starts **off**. The UI provides a sound toggle and independent cue-volume control. Preferences persist in local storage when available.
- One shared button-synth instance creates its AudioContext on the first enabled interaction. Muting immediately silences active voices. The engine limits voice counts and cleans up finished nodes; page exit disposes the context.
- All sound cues have a visible counterpart. Focus outlines, labels, textual states and live values remain usable without audio or local storage.
- Text fields give a cue when a value is committed; textareas signal new lines and capacity rather than every keystroke. Password characters are never sonified or copied into status text, and the visibility toggle keeps a stable accessible name with `aria-pressed`.
- Textareas keep their visible count in real time while announcing it on blur or near/at capacity, rather than on every keystroke. Field errors are linked to their input and remain available when it is refocused.
- Reduced motion disables visual pulses. Native input semantics and UI SDK keyboard, form, focus, and screen reader behavior are preserved. Automated tests supplement, rather than replace, assistive technology and listening checks.

## Dependencies and provenance

- [UI SDK Web Components](https://ui-sdk.dev/docs/web-components/components/slider) supplies control behavior. Installed from pnpm as `@ui-sdk/web` and `@ui-sdk/core`.
- [designerzen/button-synth](https://github.com/designerzen/button-synth) supplies the synthesis engine. Upstream is a private application package without a distributable library entry. Its [documented reuse method](https://github.com/designerzen/button-synth#reuse-the-engine) is to copy `synth.ts`, `game-profiles.ts`, and `profiles.json`; these are vendored unchanged under `src/vendor/button-synth`.
- `src/vendor/button-synth/UPSTREAM.txt` records the exact upstream commit. Its third-party notices are retained beside the source. The application authors only the short slider tick profile and chooses parameters/presets through the upstream engine.

No recorded audio assets or sound network requests are needed. The demo theme uses Google Fonts with system fallbacks.
