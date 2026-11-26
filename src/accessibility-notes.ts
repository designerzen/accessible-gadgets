import type { ComponentPage } from './pages';

export type ComponentSlug = ComponentPage['slug'];

export interface AccessibilityBreakdown {
  summary: string;
  criteria: readonly string[];
  semantics: readonly string[];
  keyboardMotor: readonly string[];
  visualSensory: readonly string[];
  cognitivePlatform: readonly string[];
}

export const accessibilityBreakdowns: Record<ComponentSlug, AccessibilityBreakdown> = {
  slider: {
    summary:
      'Range adjustments support continuous dragging alongside discrete keyboard steps and dedicated minus/plus buttons without requiring fine motor drag gestures.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.4.7 / 2.4.13 Focus',
      '2.5.5 Target Size (AAA)',
      '2.5.7 Dragging Movements',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'The inner native range input exposes the slider role, accessible label, description, min/max bounds, and localized formatted value through aria-valuetext.',
      'The visible <output> uses aria-live="off" so screen readers announce the slider control directly during keyboard or drag changes without duplicate speech.',
      'Activating the minus or plus step buttons announces the updated formatted value through a dedicated polite live region.',
    ],
    keyboardMotor: [
      'Arrow keys adjust by one step, Page Up/Down or Shift + arrows move larger steps, and Home/End jump to the minimum and maximum bounds.',
      'Step buttons provide single-tap alternatives to dragging (WCAG 2.5.7) and remain focusable with aria-disabled="true" at bounds so keyboard focus never drops.',
      'The thumb hit box and both step buttons enforce at least a 44×44 CSS-pixel activation target while preserving touch-action: pan-y pinch-zoom.',
    ],
    visualSensory: [
      'Visible focus outlines (>= 3px) wrap the thumb via :has(:focus-visible), and high-contrast track borders convey the full scale in light, dark, and forced-colors modes.',
      'Tonal audio ticks scale smoothly from 220 Hz to 880 Hz (only when sound is opted in), while the visible output and filled indicator remain primary.',
      'Reduced-motion settings cancel visual feedback pulse animations.',
    ],
    cognitivePlatform: [
      'Values format with Intl.NumberFormat for user locale conventions while submitting plain numeric values in FormData and restoring defaults on form reset.',
      'Read-only prevents value changes while keeping the control focusable and submittable; disabled excludes it from tab order and form submission.',
      'Manual check needed: verify VoiceOver adjustable-control swipe gestures and NVDA/JAWS slider announcements on real hardware.',
    ],
  },
  button: {
    summary:
      'Preserves native button activation semantics for pointer, Enter, and Space while confirming repeated activations visually, structurally, and optionally in audio.',
    criteria: [
      '1.4.3 / 1.4.6 Contrast (AAA)',
      '2.1.1 Keyboard',
      '2.4.7 / 2.4.13 Focus',
      '2.5.3 Label in Name',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Wraps a real <button type="button"> so assistive technology exposes a native button role and concise accessible name without decorative icon text (aria-hidden="true").',
      'Repeated presses increment the status count ("Activated", "Activated (2)") so polite live regions re-announce consecutive activations rather than suppressing identical strings.',
    ],
    keyboardMotor: [
      'Responds identically to pointer click, Space, and Enter keys without requiring pointer precision.',
      'Enforces a minimum 44×44 CSS-pixel hit target with clear hover and focus-visible boundaries.',
    ],
    visualSensory: [
      'Uses high-contrast accent/on-accent monochrome tokens in both light and dark color schemes and preserves system Highlight styling in forced-colors mode.',
      'Soft click synthesis is opt-in and paired with a status pulse that respects prefers-reduced-motion.',
    ],
    cognitivePlatform: [
      'Keeps visible button text aligned with the accessible name for speech-control users (WCAG 2.5.3).',
      'Supports native form submission/reset roles and UI SDK pending/focusable-when-disabled states when configured by a host app.',
      'Manual check needed: verify live-region pacing with NVDA and VoiceOver during rapid repeated activations.',
    ],
  },
  checkbox: {
    summary:
      'Supports checked, unchecked, and indeterminate states with an enlarged enclosing label hit area, keyboard Space toggling, and clear status confirmation.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.1 Use of Color',
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'UI SDK exposes the checkbox role and checked/mixed state (`aria-checked="true"`, `"false"`, or `"mixed"`) via ElementInternals.',
      'The enclosing `<label>` names the checkbox programmatically; the decorative checkmark indicator is hidden with aria-hidden="true".',
      'Status updates announce "Selected", "Not selected", or "Partially selected" in a polite status region.',
    ],
    keyboardMotor: [
      'Tab reaches the checkbox and Space toggles its state; Enter does not accidentally toggle checkboxes inside forms.',
      'Wrapping the control and its text inside a 44px-tall `<label>` gives pointer and touch users a large, forgiving tap target.',
    ],
    visualSensory: [
      'Selection is communicated through a high-contrast check symbol and filled box border, not color alone, and maps to Highlight/HighlightText in forced-colors mode.',
      'Distinct rising/falling audio tones distinguish on, off, and mixed transitions when audio is enabled.',
    ],
    cognitivePlatform: [
      'Avoids negative phrasing in labels so checked vs. unchecked meaning stays unambiguous.',
      'Participates directly in native FormData and form reset without hidden proxy inputs.',
      'Manual check needed: confirm mixed/indeterminate state announcements across VoiceOver, NVDA, and TalkBack.',
    ],
  },
  switch: {
    summary:
      'Represents an immediate binary on/off setting with high-contrast thumb borders, RTL-aware thumb travel, and synchronized visual and audio state cues.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.1 Use of Color',
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Exposes `role="switch"` and `aria-checked="true" | "false"` while keeping the setting label stable in both states.',
      'A polite status region explicitly reports "On" or "Off" alongside the visual toggle state.',
    ],
    keyboardMotor: [
      'Focusable via Tab and toggled with Space; Enter submits an enclosing form without accidentally flipping the switch.',
      'Clicking or tapping anywhere along the enclosing 44px-minimum `<label>` row toggles the switch.',
    ],
    visualSensory: [
      'The thumb renders a 2px high-contrast border against the track in both off and on states (>= 3:1 non-text contrast in light, dark, and increased-contrast modes).',
      'In forced-colors mode, the checked track adopts Highlight while the thumb maintains explicit ButtonText/Canvas contrast.',
      'Distinct on/off tones supplement visual thumb movement and status text without being required.',
    ],
    cognitivePlatform: [
      'Thumb translation reverses cleanly in right-to-left (`dir="rtl"`) layouts so the "on" end follows reading direction.',
      'Use switches for settings that apply immediately and checkboxes for selections submitted later in a form.',
      'Manual check needed: verify switch role and state announcements on iOS VoiceOver and Android TalkBack.',
    ],
  },
  radio: {
    summary:
      'Implements the WAI-ARIA radio group pattern with a single Tab stop, roving arrow-key navigation, and pitch-mapped positional cues.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.4.3 Focus Order',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      '`ui-field` connects `<ui-field-label>` to `<ui-radio-group>` (`role="radiogroup"`) via `aria-labelledby`, while each `<label>` names its `ui-radio` (`role="radio"`).',
      'Selection changes announce the chosen option name ("Daily selected") or "No selection" in the status region.',
    ],
    keyboardMotor: [
      'Provides a single Tab stop for the whole group onto the checked (or first enabled) option.',
      'Arrow keys cycle selection across enabled options; each label spans at least 44×44 CSS pixels for comfortable tapping.',
    ],
    visualSensory: [
      'The selected option displays a high-contrast inner dot in addition to border/color emphasis, preserving visibility in dark and forced-colors modes.',
      'Audio feedback shifts pitch proportionally to option index so non-visual users can gauge position in the list.',
    ],
    cognitivePlatform: [
      'Visible option labels stay concise and mutually exclusive so choices can be scanned quickly.',
      'Supports disabled individual radios, read-only groups, and native form reset back to `default-value`.',
      'Manual check needed: confirm roving focus and radio position announcements ("1 of 3") in NVDA and VoiceOver.',
    ],
  },
  select: {
    summary:
      'Follows the WAI-ARIA combobox-and-listbox pattern with full keyboard navigation, Escape focus return, visual checkmark indicators, and clean status announcements.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.1 Use of Color',
      '2.1.1 Keyboard',
      '2.1.2 No Keyboard Trap',
      '2.4.3 Focus Order',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
    ],
    semantics: [
      'The trigger button exposes `role="combobox"`, `aria-expanded`, `aria-controls`, and its field label; options expose `role="option"` inside a `listbox`.',
      'Decorative checkmarks (`ui-select-item-indicator`) use `aria-hidden="true"`, and selection text reads from `<ui-select-item-text>` so checkmarks never leak into screen reader speech.',
    ],
    keyboardMotor: [
      'Enter, Space, or Arrow keys open the popup; Arrow Up/Down and Home/End move highlight; Enter commits; Escape dismisses the popup and returns focus to the trigger.',
      'Both the trigger button and every popup option enforce at least 44px height.',
    ],
    visualSensory: [
      'Highlighted items combine background tint with an inset 3px focus ring; selected items show both bold weight and a checkmark icon (`✓`).',
      'Selected option announcements pair with positional pitch ticks when sound is enabled.',
    ],
    cognitivePlatform: [
      'Closed triggers support typeahead matching so users can jump quickly through longer lists.',
      'The popup respects logical direction and stays readable under 200% zoom and 320px reflow.',
      'Manual check needed: test popup focus transfer and scroll behavior on iOS Safari VoiceOver and macOS VoiceOver.',
    ],
  },
  input: {
    summary:
      'Preserves native text editing and browser autofill while linking persistent validation errors and acceptance feedback directly to the input.',
    criteria: [
      '1.3.5 Identify Input Purpose',
      '1.4.1 Use of Color',
      '3.3.1 Error Identification',
      '3.3.2 Labels or Instructions',
      '3.3.3 Error Suggestion',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      '`ui-field` binds the visible `<ui-field-label>` to `<input>`, and `<ag-input>` links `[data-feedback]` via `aria-describedby` so validation status stays readable on refocus.',
      '`aria-invalid="true"` is applied only when validation fails and removed once corrected; Tabbing past an untouched optional field avoids false alerts.',
    ],
    keyboardMotor: [
      'Retains standard keyboard text navigation, selection, copy/paste, and form submission behaviors.',
      'Input height meets at least 46px (`>= 44px`) for reliable pointer and touch targeting.',
    ],
    visualSensory: [
      'Invalid inputs pair a 2px dashed border with persistent error text (never relying on red color alone).',
      'Input text size is at least 16px (`max(16px, 1rem)`) to prevent unexpected iOS Safari auto-zoom on focus.',
      'Confirmation and error cues play only on commit or validation failure, never on every keystroke.',
    ],
    cognitivePlatform: [
      'Includes semantic `autocomplete="nickname"` (WCAG 1.3.5) and clear non-jargon labels and placeholders.',
      'Placeholder text maintains full opacity (`--ag-text-muted`) and never replaces the persistent visible label.',
      'Manual check needed: verify browser validation message announcement timing across NVDA, JAWS, and VoiceOver.',
    ],
  },
  number: {
    summary:
      'Combines direct numeric typing with step buttons and arrow keys, clamping out-of-range commits while preserving 44×44 touch targets.',
    criteria: [
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '3.3.1 Error Identification',
      '3.3.2 Labels or Instructions',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Exposes the field label ("Quantity") and numeric state while decrement and increment buttons use explicit `aria-label` values ("Decrease quantity", "Increase quantity") with `aria-hidden="true"` glyphs.',
      'Dynamic status messages derive the field name from the label and announce the committed value or "No value".',
    ],
    keyboardMotor: [
      'ArrowUp/ArrowDown step by 1, Shift + arrows or Page Up/Down take larger steps, Home/End jump to min/max bounds, and Enter commits typed input.',
      'Decrement and increment buttons keep a fixed 44×46px minimum target size without shrinking on narrow mobile screens.',
    ],
    visualSensory: [
      'Tabular numerals (`font-variant-numeric: tabular-nums`) stop digits from jumping horizontally as numbers change.',
      'Step tones rise in pitch across the 1–10 range when audio cues are enabled.',
    ],
    cognitivePlatform: [
      'Typed values outside `[1, 10]` clamp cleanly on commit, and step buttons disable at bounds so users receive immediate guardrail feedback.',
      'Supports locale-aware decimal formatting and submits plain numeric values in forms.',
      'Manual check needed: verify mobile virtual numeric keypad behavior and VoiceOver announcements on iOS/Android.',
    ],
  },
  textarea: {
    summary:
      'Displays a real-time visible character count for sighted users while suppressing per-keystroke speech spam in favor of blur and capacity-threshold announcements.',
    criteria: [
      '1.4.10 Reflow',
      '1.4.12 Text Spacing',
      '2.1.1 Keyboard',
      '3.3.2 Labels or Instructions',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'The visible character counter uses `aria-live="off"` and is linked to `<textarea>` via `aria-describedby` so screen reader users hear the 200-character budget upon focus without interruption while typing.',
      'A separate off-screen polite status region announces only when 20 characters remain, at the 200-character limit, or when leaving the field.',
    ],
    keyboardMotor: [
      'Enter inserts a new line cleanly without prematurely submitting forms; vertical resize remains available via pointer or keyboard settings.',
      'Supports full multi-line text selection, undo/redo, and dictation input.',
    ],
    visualSensory: [
      'Plays a subtle cue on Enter (new line) and an error cue when reaching maxlength when sound is opted in, staying silent on ordinary letters.',
      'Maintains >= 16px text size and wraps smoothly under 320px reflow and WCAG 1.4.12 text-spacing overrides.',
    ],
    cognitivePlatform: [
      'Visible live count ("0 / 200 characters") helps users pace responses before hitting the hard limit.',
      'IME composition (`event.isComposing`) is respected so multilingual input methods are not interrupted by Enter cues.',
      'Manual check needed: test announcement clarity when reaching maxlength with NVDA and VoiceOver.',
    ],
  },
  password: {
    summary:
      'Keeps the visibility toggle name stable (`Show password` + `aria-pressed`) so screen readers never announce confusing double negatives, and never leaks password characters.',
    criteria: [
      '2.1.1 Keyboard',
      '2.4.7 Focus Visible',
      '2.5.3 Label in Name',
      '2.5.5 Target Size (AAA)',
      '3.3.2 Labels or Instructions',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'The toggle button keeps a constant accessible name ("Show password") and visible label ("Show") while `@ui-sdk/core` updates `aria-pressed="false" | "true"` and `aria-controls`.',
      'Status updates announce only "Password visible" or "Password hidden" and never copy password characters into status text or audio.',
      'A dedicated polite status note surfaces "Caps Lock is on" whenever `data-capslock` is active.',
    ],
    keyboardMotor: [
      'Tab moves from the password input to the toggle button; Space or Enter activates the toggle without stealing form submission from Enter inside the input.',
      'Pointer activation of the toggle preserves caret position and selection inside the password field; target width/height exceeds 44×44 CSS pixels.',
    ],
    visualSensory: [
      'Pressed toggle buttons invert to solid accent/on-accent contrast (and Highlight/HighlightText in forced-colors mode) so visibility state is unmistakable.',
      'Distinct on/off tones cue visibility transitions when sound is enabled.',
    ],
    cognitivePlatform: [
      'Uses `autocomplete="new-password"` for password managers and disables spellcheck/autocorrect/autocapitalize even while visible.',
      'Automatically re-masks the password on form submit, form reset, and pagehide so sensitive values are not left exposed.',
      'Manual check needed: test toggle state speech ("Show password, toggle button, pressed") and Caps Lock notices in NVDA and VoiceOver.',
    ],
  },
  file: {
    summary:
      'Pairs a keyboard-accessible file picker button and constraint hint with a drag-and-drop zone, single-Tab-stop file list, and actionable rejection reasons.',
    criteria: [
      '1.3.1 Info & Relationships',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '2.5.7 Dragging Movements',
      '3.3.1 Error Identification',
      '3.3.3 Error Suggestion',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'The "Choose a file" trigger is linked to the "Text files, up to 1 MB" constraint via `aria-describedby`; the hidden native `<input type="file">` stays out of the tab and accessibility trees.',
      'Suppresses duplicate internal SDK announcements so `[data-feedback]` acts as the single authoritative polite status source; each remove button dynamically includes the filename (e.g., "Remove hello.txt").',
    ],
    keyboardMotor: [
      'Provides a full button-triggered system file picker alongside drag-and-drop and clipboard paste so no dragging gesture is required.',
      'Selected files form a navigable list with arrow keys, Home/End, and Delete/Backspace removal, plus a >= 44×44px Remove button.',
    ],
    visualSensory: [
      'Dropzone drag-over and drag-reject states vary border style and width (solid vs. dashed 2px) alongside text feedback.',
      'Distinct success, removal, and error tones cue file outcomes when sound is enabled.',
    ],
    cognitivePlatform: [
      'Rejections explain the exact reason ("unsupported file type" or "file is larger than 1 MB") alongside how to fix it ("Choose a text file under 1 MB").',
      'Files stay strictly on-device in browser memory with no automatic upload.',
      'Manual check needed: verify file picker focus return and file list keyboard navigation with VoiceOver and NVDA.',
    ],
  },
  details: {
    summary:
      'Implements the WAI-ARIA disclosure pattern with synchronized `aria-expanded` / `aria-controls`, inert collapsed content, and focusable trigger styling.',
    criteria: [
      '1.3.1 Info & Relationships',
      '2.1.1 Keyboard',
      '2.4.3 Focus Order',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'The trigger `<button>` exposes `aria-expanded="false" | "true"` and `aria-controls` referencing `<ui-collapsible-panel>`.',
      'Closed panels use the `hidden` attribute so screen readers and Tab navigation skip collapsed content completely.',
    ],
    keyboardMotor: [
      'Enter or Space toggles the panel while keeping keyboard focus on the summary trigger; Tab enters revealed interactive content in document order.',
      'Full-width trigger button exceeds the 44×44 CSS-pixel minimum height.',
    ],
    visualSensory: [
      'The `+` icon rotates to `×` on expansion (`aria-hidden="true"`), backed by explicit "Details expanded" / "Details collapsed" status text.',
      'Transition animations respect `prefers-reduced-motion: reduce`.',
    ],
    cognitivePlatform: [
      'Keeps heading/summary text concise so users can decide whether to reveal extra explanation without cluttering the page.',
      'Manual check needed: confirm expanded state announcements and reading order in screen readers.',
    ],
  },
  progress: {
    summary:
      'Exposes task completion with the `progressbar` role and avoids unsolicited noise by speaking only after explicit user-initiated updates.',
    criteria: [
      '1.4.1 Use of Color',
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Exposes `role="progressbar"`, accessible label ("Demo task"), `aria-valuemin`, `aria-valuemax`, and clamped `aria-valuenow` (or omitted for indeterminate state).',
      'The visible percentage readout is hidden from screen readers by UI SDK to avoid reading the value twice alongside `aria-valuenow`.',
    ],
    keyboardMotor: [
      '"Advance 25%" and "Reset" buttons meet 44×44 CSS-pixel targets and operate via pointer, Enter, or Space.',
      'At 100%, "Advance 25%" sets `aria-disabled="true"` rather than native `disabled` so keyboard focus does not vanish abruptly.',
    ],
    visualSensory: [
      'Track border (`1px solid var(--ag-control-border)`) clearly frames the empty 0% bar as well as the filled indicator in light, dark, and forced-colors modes.',
      'Audio feedback is strictly opt-in and event-driven (`announce` on user action), preventing background audio spam.',
    ],
    cognitivePlatform: [
      'Reports clear milestone text ("25% complete", "Complete", "Ready to begin") and supports custom `min`/`max` bounds.',
      'Manual check needed: confirm progressbar value and `aria-disabled` announcements across NVDA and VoiceOver.',
    ],
  },
  meter: {
    summary:
      'Uses the semantic `meter` role for static measurements within a known range, with an explicit on-demand read control that mutates live status text cleanly.',
    criteria: [
      '1.4.1 Use of Color',
      '1.4.11 Non-text Contrast',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Exposes `role="meter"`, `aria-label`/`aria-labelledby` ("Storage used"), `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` (65).',
      'Initial status prompts "Activate button to announce level" so activating "Read current level" mutates the live region to "65% used" and triggers a reliable announcement.',
    ],
    keyboardMotor: [
      'The "Read current level" button provides a >= 44×44px target operated via pointer, Enter, or Space.',
    ],
    visualSensory: [
      'Both numeric readout ("65%") and bordered visual gauge track communicate the measurement without relying on color thresholds.',
      'Activating the read button plays a pitch mapped to the percentage level across the 0–100 scale when sound is enabled.',
    ],
    cognitivePlatform: [
      'Distinguishes a static gauge (`meter`) from an active task (`progressbar`) so assistive technology presents accurate context.',
      'Manual check needed: verify `role="meter"` reading and percentage announcement on macOS/iOS VoiceOver and NVDA.',
    ],
  },
  link: {
    summary:
      'Preserves true `<a href>` anchor navigation semantics, focus management on in-page targets, and descriptive cross-page destinations.',
    criteria: [
      '1.4.1 Use of Color',
      '2.1.1 Keyboard',
      '2.4.3 Focus Order',
      '2.4.4 Link Purpose',
      '2.4.7 / 2.4.13 Focus',
      '2.5.5 Target Size (AAA)',
    ],
    semantics: [
      'Uses a native `<a>` element with an `href` so browsers expose link role, context menus, open-in-new-tab, and Enter activation.',
      'Decorative arrow glyph uses `aria-hidden="true"`, keeping the accessible link name clean ("Back to the slider").',
    ],
    keyboardMotor: [
      'Meets the 44×44 CSS-pixel minimum hit target height/width and activates on Enter without requiring a pointer.',
      'On the index page, `#slider` is programmatically focusable (`tabindex="-1"`) so following the anchor moves keyboard focus as well as scroll position.',
    ],
    visualSensory: [
      'Retains visible underline styling (`text-underline-offset: 4px`) so links are distinguishable without relying solely on color.',
      'Displays a >= 3px focus outline and plays an optional navigation cue upon activation.',
    ],
    cognitivePlatform: [
      'Destination text clearly explains where the link leads both on the index page and on the standalone test page.',
      'Manual check needed: verify focus placement after following the in-page anchor and cross-page navigation in real screen readers.',
    ],
  },
  'date-time': {
    summary:
      'Pairs native `<input type="date">` and `<input type="time">` controls with persistent field labels, validation linkage, and commitment announcements.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.10 Reflow',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '3.3.1 / 3.3.2 Errors & Labels',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Each native picker retains its platform segment spinbuttons/pickers, explicit label ("Choose a date", "Choose a time"), and `aria-describedby` link to its status region.',
      'Status updates report "Value accepted" or "Ready for input" when cleared without interrupting segment-by-segment typing.',
    ],
    keyboardMotor: [
      'Supports keyboard segment entry, Up/Down stepping, and native picker launch while meeting >= 44px height.',
      'Grid layout collapses from 2 columns to 1 column on narrow screens (`<= 420px`) to prevent cramping or overflow.',
    ],
    visualSensory: [
      'Respects system color scheme and forced-colors styling inside native browser pickers while maintaining >= 16px input text.',
      'Plays confirmation/error audio cues only on change/blur commitment, not while stepping individual segments.',
    ],
    cognitivePlatform: [
      'Native date/time inputs follow the user’s OS locale formatting (month/day/year order and 12/24-hour clock) automatically.',
      'Manual check needed: inspect native date/time picker popups at 200%/400% zoom and verify VoiceOver focus return when dismissing OS dialogs.',
    ],
  },
  color: {
    summary:
      'Augments `<input type="color">` with an explicit live hexadecimal text readout so color values never depend solely on visual swatch perception.',
    criteria: [
      '1.3.1 Info & Relationships',
      '1.4.1 Use of Color',
      '1.4.6 Contrast (AAA)',
      '2.1.1 Keyboard',
      '2.5.5 Target Size (AAA)',
      '4.1.2 Name, Role, Value',
      '4.1.3 Status Messages',
    ],
    semantics: [
      'Keeps the native `<input type="color">` labeled as "Accent color" and associates validation/acceptance status via `aria-describedby`.',
      'Displays a companion `<output>` (`#000000`) showing the exact hexadecimal code beside the color swatch.',
    ],
    keyboardMotor: [
      'Opens the platform color picker via click, Space, or Enter, with a 54px-tall hit target (`>= 44px`).',
    ],
    visualSensory: [
      'Satisfies WCAG 1.4.1 (Use of Color) by presenting both the color swatch and high-contrast monospace hex notation.',
      'Retains native OS color-picker visibility in forced-colors and dark modes while the surrounding UI uses AAA monochrome tokens.',
    ],
    cognitivePlatform: [
      'The initial `#000000` value is sample input data rather than a theme override; hex readout updates immediately on `input` and `change`.',
      'Manual check needed: test native color picker keyboard navigation and screen reader color/hex announcements on macOS, Windows, and iOS Safari.',
    ],
  },
};

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatText(text: string): string {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderList(items: readonly string[]): string {
  return items.map(item => `<li>${formatText(item)}</li>`).join('');
}

export function renderAccessibilityBreakdown(slug: ComponentSlug): string {
  const data = accessibilityBreakdowns[slug];
  return `
    <section class="a11y-breakdown" aria-labelledby="a11y-breakdown-title">
      <div class="a11y-breakdown-header">
        <div class="eyebrow">ACCESSIBILITY &amp; INCLUSION</div>
        <h2 id="a11y-breakdown-title">Accessibility &amp; inclusion considerations</h2>
        <p class="a11y-breakdown-summary">${formatText(data.summary)}</p>
        <ul class="a11y-criteria" aria-label="Relevant WCAG 2.2 criteria">${renderList(data.criteria)}</ul>
      </div>
      <div class="a11y-breakdown-grid">
        <div class="a11y-breakdown-card">
          <h3>Semantics &amp; screen readers</h3>
          <ul>${renderList(data.semantics)}</ul>
        </div>
        <div class="a11y-breakdown-card">
          <h3>Keyboard &amp; motor inclusion</h3>
          <ul>${renderList(data.keyboardMotor)}</ul>
        </div>
        <div class="a11y-breakdown-card">
          <h3>Visual, contrast &amp; sensory inclusion</h3>
          <ul>${renderList(data.visualSensory)}</ul>
        </div>
        <div class="a11y-breakdown-card">
          <h3>Cognitive, language &amp; platform inclusion</h3>
          <ul>${renderList(data.cognitivePlatform)}</ul>
        </div>
      </div>
    </section>
  `;
}
