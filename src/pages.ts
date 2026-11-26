export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export interface KeyboardShortcut {
  readonly keys: string;
  readonly effect: string;
}

export interface ComponentPage {
  readonly slug: string;
  readonly title: string;
  readonly card: string;
  readonly tag: string;
  readonly primitive: string;
  readonly description: string;
  readonly attributes: readonly string[];
  readonly events: readonly string[];
  readonly keyboard: readonly KeyboardShortcut[];
  readonly audioCue: string;
  readonly code: string;
  readonly checks: readonly string[];
}

export const componentPages: readonly ComponentPage[] = [
  {
    slug: 'slider',
    title: 'Slider',
    card: 'slider',
    tag: '<ag-slider>',
    primitive: 'ui-slider · role="slider"',
    description: 'Form-associated range slider with visible value output, increment/decrement step buttons, and boundary announcements.',
    attributes: ['label', 'min', 'max', 'step', 'value', 'unit', 'name', 'form', 'disabled', 'read-only'],
    events: ['input (live value)', 'change (committed)', 'valuechange / valuecommit (ui-slider)'],
    keyboard: [
      { keys: 'Left / Down', effect: 'Decrease by one step' },
      { keys: 'Right / Up', effect: 'Increase by one step' },
      { keys: 'Page Down / Page Up', effect: 'Move by a larger step' },
      { keys: 'Home / End', effect: 'Jump to minimum or maximum' },
    ],
    audioCue: 'Pitch-mapped tick from 220 Hz to 880 Hz across the range; focus cue on entry.',
    code: `<ag-slider
  label="Intensity"
  name="intensity"
  min="0"
  max="100"
  step="1"
  value="50"
  unit="%"
></ag-slider>`,
    checks: [
      'Drag the thumb and check that the value updates before releasing.',
      'Use − / +, arrow keys, Home and End. Confirm the controls stop at the limits.',
      'Enable sound and compare the low, middle and high pitches.',
    ],
  },
  {
    slug: 'button',
    title: 'Button',
    card: 'ag-button-02',
    tag: '<ag-button>',
    primitive: 'ui-button · native <button>',
    description: 'Native button wrapper that tracks activations in a live status region and announces presses audibly when enabled.',
    attributes: ['disabled', 'aria-disabled', 'type (on native <button>)'],
    events: ['action (ui-button)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter', effect: 'Activate the button' },
      { keys: 'Space', effect: 'Activate the button on key release' },
    ],
    audioCue: 'Soft press click on activation; focus cue on entry.',
    code: `<ag-button>
  <ui-button>
    <button class="primary-button" type="button">Try a button</button>
  </ui-button>
  <span data-feedback role="status" aria-atomic="true">Ready when you are</span>
</ag-button>`,
    checks: [
      'Activate the button with a click, Enter and Space.',
      'Check that Activated appears after every press.',
      'Enable sound and listen for the soft click.',
    ],
  },
  {
    slug: 'checkbox',
    title: 'Checkbox',
    card: 'ag-checkbox-03',
    tag: '<ag-checkbox>',
    primitive: 'ui-checkbox · role="checkbox"',
    description: 'Tri-state capable checkbox with a high-contrast check indicator, linked text label, and distinct checked/unchecked status cues.',
    attributes: ['name', 'value', 'default-checked', 'checked', 'indeterminate', 'disabled'],
    events: ['checkedchange (ui-checkbox)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Space', effect: 'Toggle between checked and unchecked states' },
    ],
    audioCue: 'Distinct rising "on" tone when checked, falling "off" tone when unchecked, or neutral "select" tone for indeterminate.',
    code: `<ag-checkbox>
  <label class="choice-label">
    <ui-checkbox name="updates">
      <ui-checkbox-indicator aria-hidden="true">✓</ui-checkbox-indicator>
    </ui-checkbox>
    <span>Keep me in the loop</span>
  </label>
  <span data-feedback role="status" aria-atomic="true">Not selected</span>
</ag-checkbox>`,
    checks: [
      'Click the checkbox and its text label.',
      'Focus the checkbox and press Space to toggle it.',
      'Check the visible check, status text and distinct on/off sounds.',
    ],
  },
  {
    slug: 'switch',
    title: 'Switch',
    card: 'ag-switch-04',
    tag: '<ag-switch>',
    primitive: 'ui-switch · role="switch"',
    description: 'Binary toggle switch with directional thumb travel, RTL mirroring, high-contrast thumb border, and On/Off confirmation.',
    attributes: ['name', 'value', 'default-checked', 'checked', 'disabled'],
    events: ['checkedchange (ui-switch)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Space', effect: 'Toggle switch between On and Off' },
    ],
    audioCue: 'Distinct "on" tone when turned on and "off" tone when turned off.',
    code: `<ag-switch>
  <label class="choice-label switch-label">
    <span>Gentle reminders</span>
    <ui-switch name="reminders">
      <ui-switch-thumb></ui-switch-thumb>
    </ui-switch>
  </label>
  <span data-feedback role="status" aria-atomic="true">Off</span>
</ag-switch>`,
    checks: [
      'Click the switch or its label to change the setting.',
      'Use Space to toggle it from the keyboard.',
      'Confirm that thumb position, On / Off text and sound agree.',
    ],
  },
  {
    slug: 'radio',
    title: 'Radio group',
    card: 'ag-radio-05',
    tag: '<ag-radio>',
    primitive: 'ui-radio-group · role="radiogroup" / role="radio"',
    description: 'Single-choice radio group labeled by UI Field with roving arrow-key navigation and option-indexed pitch feedback.',
    attributes: ['name', 'default-value', 'value (on group and items)', 'disabled'],
    events: ['valuechange (ui-radio-group)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Tab', effect: 'Enter or leave the radio group as one stop' },
      { keys: 'Arrow keys', effect: 'Move selection between radio options' },
    ],
    audioCue: 'Pitch-indexed tick proportional to the selected option position.',
    code: `<ag-radio>
  <ui-field>
    <ui-field-label>Notification frequency</ui-field-label>
    <ui-radio-group name="frequency" default-value="weekly">
      <label class="radio-choice">
        <ui-radio value="daily"><ui-radio-indicator></ui-radio-indicator></ui-radio>
        Daily
      </label>
      <label class="radio-choice">
        <ui-radio value="weekly"><ui-radio-indicator></ui-radio-indicator></ui-radio>
        Weekly
      </label>
    </ui-radio-group>
  </ui-field>
  <span data-feedback role="status" aria-atomic="true">Weekly selected</span>
</ag-radio>`,
    checks: [
      'Select each frequency and confirm only one option is selected.',
      'Tab into the group, then use the arrow keys.',
      'Enable sound and compare pitches across the options.',
    ],
  },
  {
    slug: 'select',
    title: 'Select',
    card: 'ag-select-06',
    tag: '<ag-select>',
    primitive: 'ui-select · role="combobox" + role="listbox"',
    description: 'Accessible listbox dropdown with keyboard navigation, Escape dismissal that restores trigger focus, and option-indexed pitch feedback.',
    attributes: ['name', 'default-value', 'value', 'disabled', 'value / label (on ui-select-item)'],
    events: ['valuechange (ui-select)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Space / Arrow Down', effect: 'Open the listbox popup' },
      { keys: 'Up / Down', effect: 'Move highlight across options' },
      { keys: 'Enter', effect: 'Commit the highlighted option' },
      { keys: 'Escape', effect: 'Close the popup and return focus to the trigger' },
    ],
    audioCue: 'Pitch-indexed tick proportional to the selected option index.',
    code: `<ag-select>
  <ui-select name="pace" default-value="steady">
    <ui-select-label>Your pace</ui-select-label>
    <ui-select-trigger>
      <button class="select-trigger" type="button">
        <ui-select-value></ui-select-value>
      </button>
    </ui-select-trigger>
    <ui-select-content>
      <ui-select-item value="slow">
        <ui-select-item-text>Take it slow</ui-select-item-text>
      </ui-select-item>
      <ui-select-item value="steady">
        <ui-select-item-text>Nice and steady</ui-select-item-text>
      </ui-select-item>
    </ui-select-content>
  </ui-select>
  <span data-feedback role="status" aria-atomic="true">Nice and steady selected</span>
</ag-select>`,
    checks: [
      'Open the list and choose an option.',
      'Use the keyboard to open, navigate and select; Escape should dismiss the list.',
      'Check the selected label, status and pitch feedback.',
    ],
  },
  {
    slug: 'input',
    title: 'Text input',
    card: 'ag-input-07',
    tag: '<ag-input>',
    primitive: 'ui-input · native <input>',
    description: 'Native text input wrapper that links status messages via aria-describedby, syncs aria-invalid state, and validates on commit or blur.',
    attributes: ['type', 'placeholder', 'autocomplete', 'maxlength', 'required (on native <input>)', 'name (on ui-field)'],
    events: ['input / change / invalid (native <input>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Tab', effect: 'Commit value or move focus to trigger validation' },
    ],
    audioCue: 'Confirmation tone ("select") when valid; distinct error tone when invalid.',
    code: `<ag-input>
  <ui-field name="display-name">
    <ui-field-label>Display name</ui-field-label>
    <ui-input>
      <input type="text" placeholder="How should we call you?" maxlength="60">
    </ui-input>
  </ui-field>
  <span data-feedback role="status" aria-atomic="true">Ready for input</span>
</ag-input>`,
    checks: [
      'Type a display name, then Tab out to commit it.',
      'Check that Value accepted appears.',
      'Clear the field and commit again; check the empty state.',
    ],
  },
  {
    slug: 'number',
    title: 'Number input',
    card: 'ag-number-08',
    tag: '<ag-number>',
    primitive: 'ui-number-input · role="spinbutton"',
    description: 'Numeric spinbutton with clamped bounds, 44px decrement and increment step buttons, and value-mapped pitch feedback.',
    attributes: ['name', 'default-value', 'min', 'max', 'step', 'disabled'],
    events: ['valuechange (ui-number-input)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Up / Down', effect: 'Increment or decrement by one step' },
      { keys: 'Enter', effect: 'Commit typed numeric text' },
    ],
    audioCue: 'Pitch-mapped tick across [min, max] on every accepted value change.',
    code: `<ag-number>
  <ui-field>
    <ui-field-label>Quantity</ui-field-label>
    <ui-number-input name="quantity" default-value="3" min="1" max="10">
      <ui-number-input-group>
        <ui-number-input-decrement><button type="button" aria-label="Decrease quantity">−</button></ui-number-input-decrement>
        <ui-number-input-control><input aria-label="Quantity"></ui-number-input-control>
        <ui-number-input-increment><button type="button" aria-label="Increase quantity">+</button></ui-number-input-increment>
      </ui-number-input-group>
    </ui-number-input>
  </ui-field>
  <span data-feedback role="status" aria-atomic="true">Quantity: 3</span>
</ag-number>`,
    checks: [
      'Type a quantity and commit it with Enter.',
      'Try both step buttons and the up/down arrow keys.',
      'Check that values stay between 1 and 10 and pitch rises with the value.',
    ],
  },
  {
    slug: 'textarea',
    title: 'Textarea',
    card: 'ag-textarea-09',
    tag: '<ag-textarea>',
    primitive: 'ui-textarea · native <textarea>',
    description: 'Multi-line text area with a visible character counter kept off polite speech per keystroke, announcing thresholds and blur totals responsibly.',
    attributes: ['rows', 'maxlength', 'placeholder (on native <textarea>)', 'name (on ui-field)'],
    events: ['input / blur / keydown (native <textarea>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter', effect: 'Insert a new line and play optional newline cue' },
      { keys: 'Tab', effect: 'Leave the field and announce final character count' },
    ],
    audioCue: 'Subtle tone on Enter (non-composing) and error cue at maxlength; avoids per-keystroke audio noise.',
    code: `<ag-textarea>
  <ui-field name="note">
    <ui-field-label>A little note</ui-field-label>
    <ui-textarea>
      <textarea rows="3" maxlength="200" placeholder="Make yourself at home…"></textarea>
    </ui-textarea>
  </ui-field>
  <span data-feedback role="status" aria-atomic="true">0 / 200 characters</span>
</ag-textarea>`,
    checks: [
      'Type, paste and delete text; check the live character count.',
      'Enable sound and press Enter for a new-line cue.',
      'Reach the 200-character limit and check the capacity feedback.',
    ],
  },
  {
    slug: 'password',
    title: 'Password input',
    card: 'ag-password-10',
    tag: '<ag-password>',
    primitive: 'ui-password-input · native <input type="password|text">',
    description: 'Password entry field with Caps Lock status indicator and a visibility toggle button that retains a stable accessible name and aria-pressed state.',
    attributes: ['name', 'autocomplete', 'placeholder', 'data-capslock (managed by SDK)'],
    events: ['visiblechange (ui-password-input)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Tab', effect: 'Move from password input to Show password toggle' },
      { keys: 'Enter / Space', effect: 'Toggle password visibility while focused on Show button' },
    ],
    audioCue: 'Plays "on" when shown and "off" when hidden; never sonifies or copies typed characters.',
    code: `<ag-password>
  <ui-field>
    <ui-field-label>Password</ui-field-label>
    <ui-password-input name="password">
      <input autocomplete="new-password" placeholder="Type a demo password">
      <ui-password-input-toggle><button type="button" aria-label="Show password">Show</button></ui-password-input-toggle>
    </ui-password-input>
  </ui-field>
  <span class="caps-lock-note" data-caps-lock role="status" aria-live="polite"></span>
  <span data-feedback role="status" aria-atomic="true">Password hidden</span>
</ag-password>`,
    checks: [
      'Enter a demo password, then toggle Show password on and off.',
      'Check that the visible state, pressed state and status text agree without leaking characters.',
      'Use the keyboard to toggle visibility and listen for distinct cues.',
    ],
  },
  {
    slug: 'file',
    title: 'File input',
    card: 'ag-file-11',
    tag: '<ag-file>',
    primitive: 'ui-file-input · dropzone + native file picker',
    description: 'Local-only file selector pairing a drag-and-drop region with an accessible browse button, validation messages, and removable file items.',
    attributes: ['name', 'accept', 'max-size', 'min-size', 'max-files'],
    events: ['valuechange (ui-file-input)', 'reject (validation failure)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Space', effect: 'Open system file picker on trigger button or remove a selected item' },
    ],
    audioCue: 'Success cue on accepted selection, off cue when cleared, error cue on rejected file.',
    code: `<ag-file>
  <ui-file-input name="attachment" accept=".txt,text/plain" max-size="1048576">
    <ui-file-input-dropzone>
      <span id="ag-file-hint">Text files, up to 1 MB</span>
      <ui-file-input-trigger><button type="button" aria-describedby="ag-file-hint">Choose a file</button></ui-file-input-trigger>
    </ui-file-input-dropzone>
    <ui-file-input-list aria-label="Selected files"></ui-file-input-list>
  </ui-file-input>
  <span data-feedback role="status" aria-atomic="true">No files selected</span>
</ag-file>`,
    checks: [
      'Choose or drop a text file smaller than 1 MB.',
      'Confirm the file name and accepted status, then remove it.',
      'Try an image or oversized file and check rejection feedback.',
    ],
  },
  {
    slug: 'details',
    title: 'Details and summary',
    card: 'ag-details-12',
    tag: '<ag-details>',
    primitive: 'ui-collapsible · button[aria-expanded] + panel',
    description: 'Disclosure panel exposing aria-expanded state, keyboard toggle support, and synchronized status and audio feedback.',
    attributes: ['default-open', 'open', 'disabled', 'hidden (on ui-collapsible-panel)'],
    events: ['openchange (ui-collapsible)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Space', effect: 'Toggle panel visibility from trigger button' },
    ],
    audioCue: 'Plays "on" when expanded and "off" when collapsed.',
    code: `<ag-details>
  <ui-collapsible>
    <ui-collapsible-trigger>
      <button class="disclosure-trigger" type="button" aria-expanded="false">What makes these accessible?</button>
    </ui-collapsible-trigger>
    <ui-collapsible-panel hidden>
      <p>Visible labels, generous targets, keyboard controls, and optional sounds.</p>
    </ui-collapsible-panel>
  </ui-collapsible>
  <span data-feedback role="status" aria-atomic="true">Details collapsed</span>
</ag-details>`,
    checks: [
      'Open and close the panel with a pointer.',
      'Focus the summary and use Enter or Space.',
      'Confirm the panel, expanded state, status and audio agree.',
    ],
  },
  {
    slug: 'progress',
    title: 'Progress',
    card: 'ag-progress-13',
    tag: '<ag-progress>',
    primitive: 'ui-progress · role="progressbar"',
    description: 'Determinate progress indicator that stays quiet during passive updates and announces completion only on explicit announce events.',
    attributes: ['value (omit for indeterminate)', 'min', 'max'],
    events: ['announce (custom event on <ag-progress>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Space', effect: 'Activate the step or reset demo buttons' },
    ],
    audioCue: 'Pitch-mapped tick along [min, max] on announce; success chime at maximum.',
    code: `<ag-progress>
  <ui-progress value="0">
    <div class="gauge-heading">
      <ui-progress-label>Demo task</ui-progress-label>
      <ui-progress-value></ui-progress-value>
    </div>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
  <span data-feedback role="status" aria-atomic="true">Ready to begin</span>
</ag-progress>`,
    checks: [
      'Advance the task in 25% steps.',
      'Check the live percentage and completion confirmation at 100%.',
      'Reset the task and check it returns to zero.',
    ],
  },
  {
    slug: 'meter',
    title: 'Meter',
    card: 'ag-meter-14',
    tag: '<ag-meter>',
    primitive: 'ui-meter · role="meter"',
    description: 'Scalar gauge with bordered track contrast, screen-reader value semantics, and an explicit on-demand level announcement trigger.',
    attributes: ['value', 'min', 'max', 'low', 'high', 'optimum'],
    events: ['announce (custom event on <ag-meter>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Space', effect: 'Activate Read current level button to announce measurement' },
    ],
    audioCue: 'Pitch-mapped tick representing the current value within [min, max] when announced.',
    code: `<ag-meter>
  <ui-meter value="65">
    <div class="gauge-heading">
      <ui-meter-label>Storage used</ui-meter-label>
      <ui-meter-value></ui-meter-value>
    </div>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>
  <span data-feedback role="status" aria-atomic="true">Activate button to announce level</span>
</ag-meter>`,
    checks: [
      'Check that the visible level is 65%.',
      'Enable sound and activate Read current level.',
      'Check the same measurement is available to a screen reader.',
    ],
  },
  {
    slug: 'link',
    title: 'Link',
    card: 'ag-link-15',
    tag: '<ag-link>',
    primitive: 'native <a> element',
    description: 'Standard anchor navigation wrapper preserving native link semantics, 44px target height, clear focus outline, and activation feedback.',
    attributes: ['href', 'target', 'rel (standard HTML anchor attributes)'],
    events: ['click (native <a>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter', effect: 'Follow the link' },
    ],
    audioCue: 'Confirmation "select" cue when activated; focus cue on entry.',
    code: `<ag-link>
  <a class="demo-link" href="#slider">Back to the slider</a>
  <span data-feedback role="status" aria-atomic="true">Follow the link to explore</span>
</ag-link>`,
    checks: [
      'Tab to the link and check the focus outline.',
      'Enable sound and follow the link using Enter.',
      'Confirm that it opens the slider test page.',
    ],
  },
  {
    slug: 'date-time',
    title: 'Date and time inputs',
    card: 'ag-input-16',
    tag: '<ag-input>',
    primitive: 'ui-input · <input type="date"> / <input type="time">',
    description: 'Native date and time pickers wrapped with visible UI Field labels, platform calendar/clock pickers, and validation feedback.',
    attributes: ['type="date" | "time"', 'min', 'max', 'step', 'required'],
    events: ['change / blur / invalid (native <input>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Arrow keys / digits', effect: 'Navigate and edit date or time segments' },
      { keys: 'Space / Alt+Down', effect: 'Open native picker popup where supported' },
    ],
    audioCue: 'Confirmation "select" cue when accepted, error cue if invalid.',
    code: `<ag-input>
  <ui-field name="date">
    <ui-field-label>Choose a date</ui-field-label>
    <ui-input><input type="date" aria-label="Choose a date"></ui-input>
  </ui-field>
  <span data-feedback role="status" aria-atomic="true">No date selected</span>
</ag-input>`,
    checks: [
      'Choose a date and time with the native pickers or keyboard.',
      'Commit each field and check its acceptance status.',
      'Clear each value and check its empty state.',
    ],
  },
  {
    slug: 'color',
    title: 'Color input',
    card: 'ag-input-17',
    tag: '<ag-input>',
    primitive: 'ui-input · <input type="color">',
    description: 'Native color well paired with a synchronized hexadecimal <output> readout so color choices never rely on swatch perception alone.',
    attributes: ['type="color"', 'value (hex string)', 'aria-label'],
    events: ['input / change (native <input>)', 'feedback (detail: { text })'],
    keyboard: [
      { keys: 'Enter / Space', effect: 'Open the system color picker' },
    ],
    audioCue: 'Confirmation "select" cue when a color selection is committed.',
    code: `<ag-input>
  <ui-field name="color">
    <ui-field-label>Accent color</ui-field-label>
    <div class="color-control-row">
      <ui-input><input type="color" value="#000000" aria-label="Accent color"></ui-input>
      <output class="color-value">#000000</output>
    </div>
  </ui-field>
  <span data-feedback role="status" aria-atomic="true">Choose your color</span>
</ag-input>`,
    checks: [
      'Open the native color picker.',
      'Choose a different color and commit the selection.',
      'Check the swatch, accepted status and optional sound.',
    ],
  },
] as const;

export function renderComponentDocs(page: ComponentPage): string {
  const keyboardItems = page.keyboard
    .map(shortcut => `<li><kbd>${escapeHtml(shortcut.keys)}</kbd> — ${escapeHtml(shortcut.effect)}</li>`)
    .join('');

  return `
    <section class="component-docs" aria-labelledby="component-docs-title">
      <h2 id="component-docs-title">Usage &amp; code</h2>
      <dl class="spec-list">
        <div class="spec-item">
          <dt>Custom element</dt>
          <dd><code>${escapeHtml(page.tag)}</code></dd>
        </div>
        <div class="spec-item">
          <dt>Underlying primitive</dt>
          <dd><code>${escapeHtml(page.primitive)}</code></dd>
        </div>
        <div class="spec-item">
          <dt>Key attributes</dt>
          <dd>${page.attributes.map(attr => `<code>${escapeHtml(attr)}</code>`).join(', ')}</dd>
        </div>
        <div class="spec-item">
          <dt>Events</dt>
          <dd>${page.events.map(evt => `<code>${escapeHtml(evt)}</code>`).join(', ')}</dd>
        </div>
        <div class="spec-item">
          <dt>Keyboard interaction</dt>
          <dd><ul class="keyboard-list">${keyboardItems}</ul></dd>
        </div>
        <div class="spec-item">
          <dt>Audio feedback</dt>
          <dd>${escapeHtml(page.audioCue)}</dd>
        </div>
      </dl>
      <div class="code-header">
        <h3 id="component-code-title">Copy-ready example</h3>
        <button type="button" class="copy-code-button" data-copy-code>Copy code</button>
      </div>
      <span class="sr-only" data-copy-status role="status" aria-atomic="true"></span>
      <pre class="code-block"><code data-code-source>${escapeHtml(page.code)}</code></pre>
    </section>
  `;
}
