import { componentPages, escapeHtml } from './pages';

const pageBySlug = new Map(componentPages.map(page => [page.slug, page]));
const status = (text: string) => `<span class="feedback-status" data-feedback role="status" aria-atomic="true">${text}</span>`;

const demoMarkupBySlug: Record<string, string> = {
  button: `<ag-button class="demo-surface"><ui-button><button class="primary-button" type="button">Try a button <span aria-hidden="true">↗</span></button></ui-button>${status('Ready when you are')}</ag-button>`,
  checkbox: `<ag-checkbox class="demo-surface"><label class="choice-label"><ui-checkbox name="updates"><ui-checkbox-indicator aria-hidden="true">✓</ui-checkbox-indicator></ui-checkbox><span>Keep me in the loop</span></label>${status('Not selected')}</ag-checkbox>`,
  switch: `<ag-switch class="demo-surface"><label class="choice-label switch-label"><span>Gentle reminders</span><ui-switch name="reminders"><ui-switch-thumb></ui-switch-thumb></ui-switch></label>${status('Off')}</ag-switch>`,
  radio: `<ag-radio class="demo-surface"><ui-field><ui-field-label>Notification frequency</ui-field-label><ui-radio-group name="frequency" default-value="weekly">${[['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly']].map(([value, label]) => `<label class="radio-choice"><ui-radio value="${value}"><ui-radio-indicator></ui-radio-indicator></ui-radio>${label}</label>`).join('')}</ui-radio-group></ui-field>${status('Weekly selected')}</ag-radio>`,
  select: `<ag-select class="demo-surface"><ui-select name="pace" default-value="steady"><ui-select-label>Your pace</ui-select-label><ui-select-trigger><button class="select-trigger" type="button"><ui-select-value></ui-select-value><span aria-hidden="true">⌄</span></button></ui-select-trigger><ui-select-content>${[['slow', 'Take it slow'], ['steady', 'Nice and steady'], ['fast', 'Full speed ahead']].map(([value, label]) => `<ui-select-item value="${value}"><ui-select-item-text>${label}</ui-select-item-text><ui-select-item-indicator aria-hidden="true">✓</ui-select-item-indicator></ui-select-item>`).join('')}</ui-select-content></ui-select>${status('Nice and steady selected')}</ag-select>`,
  input: `<ag-input class="demo-surface"><ui-field name="display-name"><ui-field-label>Display name</ui-field-label><ui-input><input type="text" placeholder="How should we call you?" autocomplete="nickname" maxlength="60"></ui-input></ui-field>${status('Ready for input')}</ag-input>`,
  number: `<ag-number class="demo-surface"><ui-field><ui-field-label>Quantity</ui-field-label><ui-number-input name="quantity" default-value="3" min="1" max="10"><ui-number-input-group><ui-number-input-decrement><button type="button" aria-label="Decrease quantity"><span aria-hidden="true">−</span></button></ui-number-input-decrement><ui-number-input-control><input aria-label="Quantity"></ui-number-input-control><ui-number-input-increment><button type="button" aria-label="Increase quantity"><span aria-hidden="true">+</span></button></ui-number-input-increment></ui-number-input-group></ui-number-input></ui-field>${status('Quantity: 3')}</ag-number>`,
  textarea: `<ag-textarea class="demo-surface"><ui-field name="note"><ui-field-label>A little note</ui-field-label><ui-textarea><textarea rows="3" maxlength="200" placeholder="Make yourself at home…"></textarea></ui-textarea></ui-field>${status('0 / 200 characters')}</ag-textarea>`,
  password: `<ag-password class="demo-surface"><ui-field><ui-field-label>Password</ui-field-label><ui-password-input name="password"><input autocomplete="new-password" placeholder="Type a demo password"><ui-password-input-toggle><button type="button" aria-label="Show password">Show</button></ui-password-input-toggle></ui-password-input></ui-field><span class="caps-lock-note" data-caps-lock role="status" aria-live="polite"></span>${status('Password hidden')}</ag-password>`,
  file: `<ag-file class="demo-surface"><ui-file-input name="attachment" accept=".txt,text/plain" max-size="1048576"><ui-file-input-dropzone><span aria-hidden="true">↑</span><span id="ag-file-hint">Text files, up to 1 MB</span><ui-file-input-trigger><button type="button" aria-describedby="ag-file-hint">Choose a file</button></ui-file-input-trigger></ui-file-input-dropzone><ui-file-input-list aria-label="Selected files"><template><ui-file-input-item><span data-file="name"></span><ui-file-input-item-remove><button type="button">Remove</button></ui-file-input-item-remove></ui-file-input-item></template></ui-file-input-list></ui-file-input>${status('No files selected')}</ag-file>`,
  details: `<ag-details class="demo-surface"><ui-collapsible><ui-collapsible-trigger><button class="disclosure-trigger" type="button" aria-expanded="false">What makes these accessible?<span aria-hidden="true">+</span></button></ui-collapsible-trigger><ui-collapsible-panel hidden><p>Visible labels, generous targets, keyboard controls, and optional sounds. Every audio cue has a visual counterpart. Reduced motion and high contrast preferences are respected.</p></ui-collapsible-panel></ui-collapsible>${status('Details collapsed')}</ag-details>`,
  progress: `<ag-progress class="demo-surface"><ui-progress value="0"><div class="gauge-heading"><ui-progress-label>Demo task</ui-progress-label><ui-progress-value></ui-progress-value></div><ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track></ui-progress><div class="inline-actions"><button type="button" data-progress-step>Advance 25%</button><button type="button" data-progress-reset>Reset</button></div>${status('Ready to begin')}</ag-progress>`,
  meter: `<ag-meter class="demo-surface"><ui-meter value="65"><div class="gauge-heading"><ui-meter-label>Storage used</ui-meter-label><ui-meter-value></ui-meter-value></div><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter><button type="button" data-meter-listen>Read current level <span aria-hidden="true">♪</span></button>${status('Activate button to announce level')}</ag-meter>`,
  link: `<ag-link class="demo-surface"><a class="demo-link" href="#slider">Back to the slider <span aria-hidden="true">↗</span></a>${status('Follow the link to explore')}</ag-link>`,
  'date-time': `<div class="date-time-row"><ag-input class="demo-surface"><ui-field name="date"><ui-field-label>Choose a date</ui-field-label><ui-input><input type="date" aria-label="Choose a date"></ui-input></ui-field>${status('No date selected')}</ag-input><ag-input class="demo-surface"><ui-field name="time"><ui-field-label>Choose a time</ui-field-label><ui-input><input type="time" aria-label="Choose a time"></ui-input></ui-field>${status('No time selected')}</ag-input></div>`,
  color: `<ag-input class="demo-surface"><ui-field name="color"><ui-field-label>Accent color</ui-field-label><div class="color-control-row"><ui-input><input type="color" value="#000000" aria-label="Accent color"></ui-input><output class="color-value" data-color-value>#000000</output></div></ui-field>${status('Choose your color')}</ag-input>`,
};

export function renderCollection(root: HTMLElement, onlySlug?: string, basePath = './', signal?: AbortSignal) {
  const entries = onlySlug
    ? componentPages.filter(page => page.slug === onlySlug && page.slug in demoMarkupBySlug)
    : componentPages.filter(page => page.slug in demoMarkupBySlug);

  root.innerHTML = entries.map(page => {
    const rawBody = demoMarkupBySlug[page.slug];
    const body = basePath === '../' ? rawBody.replace('href="#slider"', 'href="../slider/"') : rawBody;

    if (onlySlug) {
      return `<article class="widget-card" id="${page.card}">${body}</article>`;
    }

    return `<article class="widget-card" id="${page.card}">
      <div class="card-header">
        <div>
          <h3>${escapeHtml(page.title)}</h3>
          <span class="component-primitive">${escapeHtml(page.primitive)}</span>
        </div>
        <code class="component-tag">${escapeHtml(page.tag)}</code>
      </div>
      <p class="card-description">${escapeHtml(page.description)}</p>
      ${body}
      <details class="card-code">
        <summary>Code example</summary>
        <pre class="code-block"><code>${escapeHtml(page.code)}</code></pre>
      </details>
      <div class="card-footer">
        <code>${escapeHtml(page.tag)}</code>
        <a class="test-page-link" href="${basePath}components/${page.slug}/">Open ${escapeHtml(page.title)} test page <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }).join('');

  if (onlySlug && !pageBySlug.has(onlySlug)) return;

  const progress = root.querySelector('ag-progress');
  const progressBar = progress?.querySelector('ui-progress');
  const progressStep = root.querySelector<HTMLButtonElement>('[data-progress-step]');
  const progressFeedback = progress?.querySelector<HTMLElement>('[data-feedback]');
  progressStep?.addEventListener('click', () => {
    if (!progress || !progressBar || progressStep.getAttribute('aria-disabled') === 'true') return;
    const next = Math.min(100, Number(progressBar.getAttribute('value') ?? 0) + 25);
    progressBar.setAttribute('value', String(next));
    progressStep.setAttribute('aria-disabled', String(next >= 100));
    progress.dispatchEvent(new Event('announce'));
  }, { signal });
  root.querySelector('[data-progress-reset]')?.addEventListener('click', () => {
    if (!progress || !progressBar) return;
    progressBar.setAttribute('value', '0');
    progressStep?.removeAttribute('aria-disabled');
    if (progressFeedback) progressFeedback.textContent = 'Ready to begin';
  }, { signal });
  root.querySelector('[data-meter-listen]')?.addEventListener('click', () => {
    root.querySelector('ag-meter')?.dispatchEvent(new Event('announce'));
  }, { signal });
  root.querySelectorAll<HTMLInputElement>('input[type="color"]').forEach(input => {
    const readout = input.closest('.color-control-row')?.querySelector<HTMLOutputElement>('[data-color-value]');
    const syncColor = () => { if (readout) readout.textContent = input.value; };
    syncColor();
    input.addEventListener('input', syncColor, { signal });
    input.addEventListener('change', syncColor, { signal });
  });
}
