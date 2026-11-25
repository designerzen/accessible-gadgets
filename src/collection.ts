const status = (text: string) => `<span class="feedback-status" data-feedback role="status">${text}</span>`;
const card = (number: string, type: string, title: string, cue: string, description: string, contents: string, tag: string) => `
  <article class="widget-card" id="${tag}-${number}"><div class="card-heading"><div><span class="component-number">${number} — ${type}</span><h3>${title}</h3></div><span class="cue-tag">${cue}</span></div><p class="card-description">${description}</p>${contents}<div class="card-footer"><span><i class="small-dot"></i> Keyboard ready · Visual + audio feedback</span><code>&lt;${tag}&gt;</code></div></article>`;

export function mountCollection(root: HTMLElement, onlyCard?: string) {
  const cards = [
    card('02', 'BUTTON', 'A satisfying action', '↓ Soft click', 'A deliberate press, with a tactile little response.', `
      <ag-button class="demo-surface"><ui-button><button class="primary-button" type="button">Try a button <span aria-hidden="true">↗</span></button></ui-button>${status('Ready when you are')}</ag-button>`, 'ag-button'),
    card('03', 'CHECKBOX', 'A clear choice', '✓ On / off', 'A visible check and two distinct tones for each state.', `
      <ag-checkbox class="demo-surface"><label class="choice-label"><ui-checkbox name="updates"><ui-checkbox-indicator aria-hidden="true">✓</ui-checkbox-indicator></ui-checkbox><span>Keep me in the loop</span></label>${status('Not selected')}</ag-checkbox>`, 'ag-checkbox'),
    card('04', 'SWITCH', 'A change you can feel', '↕ Two states', 'A setting that says exactly where it stands.', `
      <ag-switch class="demo-surface"><label class="choice-label switch-label"><span>Gentle reminders</span><ui-switch name="reminders"><ui-switch-thumb></ui-switch-thumb></ui-switch></label>${status('Off')}</ag-switch>`, 'ag-switch'),
    card('05', 'RADIO GROUP', 'One at a time', '↗ Position → pitch', 'Use the arrow keys to hear your place in the choices.', `
      <ag-radio class="demo-surface"><ui-field><ui-field-label>Notification frequency</ui-field-label><ui-radio-group name="frequency" default-value="weekly">${[['daily','Daily'],['weekly','Weekly'],['monthly','Monthly']].map(([value,label]) => `<label class="radio-choice"><ui-radio value="${value}"><ui-radio-indicator></ui-radio-indicator></ui-radio>${label}</label>`).join('')}</ui-radio-group></ui-field>${status('Weekly selected')}</ag-radio>`, 'ag-radio'),
    card('06', 'SELECT', 'Find your rhythm', '↗ Option → pitch', 'An ordinary dropdown, with an extra sense of position.', `
      <ag-select class="demo-surface"><ui-select name="pace" default-value="steady"><ui-select-label>Your pace</ui-select-label><ui-select-trigger><button class="select-trigger" type="button"><ui-select-value></ui-select-value><span aria-hidden="true">⌄</span></button></ui-select-trigger><ui-select-content>${[['slow','Take it slow'],['steady','Nice and steady'],['fast','Full speed ahead']].map(([value,label]) => `<ui-select-item value="${value}">${label}</ui-select-item>`).join('')}</ui-select-content></ui-select>${status('Nice and steady selected')}</ag-select>`, 'ag-select'),
    card('07', 'TEXT INPUT', 'Just the right words', '✓ Value accepted', 'Clear text, a useful label, and feedback when you finish.', `
      <ag-input class="demo-surface"><ui-field name="display-name"><ui-field-label>Display name</ui-field-label><ui-input><input type="text" placeholder="How should we call you?" autocomplete="nickname" maxlength="60"></ui-input></ui-field>${status('Ready for input')}</ag-input>`, 'ag-input'),
    card('08', 'NUMBER INPUT', 'Every step counts', '↗ Value → pitch', 'Type a number, use the arrows, or tap the step buttons.', `
      <ag-number class="demo-surface"><ui-field><ui-field-label>Quantity</ui-field-label><ui-number-input name="quantity" default-value="3" min="1" max="10"><ui-number-input-group><ui-number-input-decrement><button type="button" aria-label="Decrease quantity">−</button></ui-number-input-decrement><ui-number-input-control><input aria-label="Quantity"></ui-number-input-control><ui-number-input-increment><button type="button" aria-label="Increase quantity">+</button></ui-number-input-increment></ui-number-input-group></ui-number-input></ui-field>${status('Quantity: 3')}</ag-number>`, 'ag-number'),
    card('09', 'TEXTAREA', 'Room to express yourself', '↵ New-line cue', 'A live character count. A soft cue for a fresh line.', `
      <ag-textarea class="demo-surface"><ui-field name="note"><ui-field-label>A little note</ui-field-label><ui-textarea><textarea rows="3" maxlength="200" placeholder="Make yourself at home…"></textarea></ui-textarea></ui-field>${status('0 / 200 characters')}</ag-textarea>`, 'ag-textarea'),
    card('10', 'PASSWORD', 'Know what’s showing', '↕ Show / hide', 'Visibility has a clear label, a clear state, and its own sound.', `
      <ag-password class="demo-surface"><ui-field><ui-field-label>Password</ui-field-label><ui-password-input name="password"><input autocomplete="new-password" placeholder="Type a demo password"><ui-password-input-toggle><button type="button" aria-label="Show password">Show</button></ui-password-input-toggle></ui-password-input></ui-field>${status('Password hidden')}</ag-password>`, 'ag-password'),
    card('11', 'FILE INPUT', 'A welcome arrival', '✓ File accepted', 'Browse or drop a text file. Nothing leaves your device.', `
      <ag-file class="demo-surface"><ui-file-input name="attachment" accept=".txt,text/plain" max-size="1048576"><ui-file-input-dropzone><span aria-hidden="true">↑</span><span>Text files, up to 1 MB</span><ui-file-input-trigger><button type="button">Choose a file</button></ui-file-input-trigger></ui-file-input-dropzone><ui-file-input-list aria-label="Selected files"><template><ui-file-input-item><span data-file="name"></span><ui-file-input-item-remove><button type="button" aria-label="Remove file">Remove</button></ui-file-input-item-remove></ui-file-input-item></template></ui-file-input-list></ui-file-input>${status('No files selected')}</ag-file>`, 'ag-file'),
    card('12', 'DETAILS / SUMMARY', 'A little more to discover', '↕ Open / close', 'An expanding panel with an unmistakable change of state.', `
      <ag-details class="demo-surface"><ui-collapsible><ui-collapsible-trigger><button class="disclosure-trigger" type="button">What makes these accessible?<span aria-hidden="true">+</span></button></ui-collapsible-trigger><ui-collapsible-panel hidden><p>Visible labels, generous targets, keyboard controls, and optional sounds. Every audio cue has a visual counterpart. Reduced motion and high contrast preferences are respected.</p></ui-collapsible-panel></ui-collapsible>${status('Details collapsed')}</ag-details>`, 'ag-details'),
    card('13', 'PROGRESS', 'Hear how far you’ve come', '✓ Completion cue', 'Advance the demo to hear the value rise, then a confirmation.', `
      <ag-progress class="demo-surface"><ui-progress value="0"><div class="gauge-heading"><ui-progress-label>Demo task</ui-progress-label><ui-progress-value></ui-progress-value></div><ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track></ui-progress><div class="inline-actions"><button type="button" data-progress-step>Advance 25%</button><button type="button" data-progress-reset>Reset</button></div>${status('Ready to begin')}</ag-progress>`, 'ag-progress'),
    card('14', 'METER', 'A measure of clarity', '↗ Level → pitch', 'Read a measurement at a glance, or listen to its level.', `
      <ag-meter class="demo-surface"><ui-meter value="65"><div class="gauge-heading"><ui-meter-label>Storage used</ui-meter-label><ui-meter-value></ui-meter-value></div><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter><button type="button" data-meter-listen>Read current level <span aria-hidden="true">♪</span></button>${status('65% used')}</ag-meter>`, 'ag-meter'),
    card('15', 'LINK', 'A useful connection', '↗ Navigation cue', 'The same familiar link, with focus and activation feedback.', `
      <ag-link class="demo-surface"><a class="demo-link" href="#slider">Back to the slider <span aria-hidden="true">↗</span></a>${status('Follow the link to explore')}</ag-link>`, 'ag-link'),
    card('16', 'DATE & TIME', 'A moment of your choosing', '✓ Value accepted', 'Native date and time pickers, with feedback on commitment.', `
      <div class="date-time-row"><ag-input class="demo-surface"><ui-field name="date"><ui-field-label>Choose a date</ui-field-label><ui-input><input type="date" aria-label="Choose a date"></ui-input></ui-field>${status('No date selected')}</ag-input><ag-input class="demo-surface"><ui-field name="time"><ui-field-label>Choose a time</ui-field-label><ui-input><input type="time" aria-label="Choose a time"></ui-input></ui-field>${status('No time selected')}</ag-input></div>`, 'ag-input'),
    card('17', 'COLOR INPUT', 'A brighter response', '✓ Color accepted', 'The native color picker keeps its familiar behavior.', `
      <ag-input class="demo-surface"><ui-field name="color"><ui-field-label>Accent color</ui-field-label><ui-input><input type="color" value="#000000" aria-label="Accent color"></ui-input></ui-field>${status('Choose your color')}</ag-input>`, 'ag-input'),
  ];
  root.innerHTML = cards.filter(html => !onlyCard || html.includes(`id="${onlyCard}"`)).join('');
  // Demo actions are separate from reusable widgets.
  const progress = root.querySelector('ui-progress')!;
  const advance = root.querySelector<HTMLButtonElement>('[data-progress-step]')!;
  advance?.addEventListener('click', () => {
    const value = Math.min(100, Number(progress.getAttribute('value')) + 25);
    progress.setAttribute('value', String(value));
    advance.setAttribute('aria-disabled', String(value === 100));
    if (Number(progress.getAttribute('data-last-announced') ?? -1) === value) return;
    progress.setAttribute('data-last-announced', String(value));
    progress.closest('ag-progress')!.dispatchEvent(new Event('announce'));
  });
  root.querySelector('[data-progress-reset]')?.addEventListener('click', () => {
    progress.setAttribute('value', '0');
    progress.removeAttribute('data-last-announced');
    advance.setAttribute('aria-disabled', 'false');
    root.querySelector('ag-progress [data-feedback]')!.textContent = 'Ready to begin';
  });
  root.querySelector('[data-meter-listen]')?.addEventListener('click', () => {
    root.querySelector('ag-meter')!.dispatchEvent(new Event('announce'));
  });
}

