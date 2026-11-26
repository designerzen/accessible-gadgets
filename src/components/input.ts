import '@ui-sdk/web/input';
import { audio } from '../audio';
import { defineFeedback } from './feedback';

let nextFeedbackId = 0;

// Works with native text, email, URL, tel, search, date, time and colour inputs.
defineFeedback('ag-input', host => {
  const input = host.querySelector('input');
  if (!input) return;
  const feedback = host.querySelector<HTMLElement>('[data-feedback]');
  if (feedback) {
    feedback.id ||= `ag-input-feedback-${++nextFeedbackId}`;
    const descriptions = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    descriptions.add(feedback.id);
    input.setAttribute('aria-describedby', [...descriptions].join(' '));
  }
  let lastReport = '';
  let interacted = false;
  const report = (withSound = true) => {
    const valid = input.validity.valid;
    const message = !input.value ? (input.required ? 'A value is required' : 'Ready for input') : valid ? 'Value accepted' : input.validationMessage;
    const field = input.closest('ui-field');
    if (field) field.invalid = valid ? undefined : true;
    if (valid) input.removeAttribute('aria-invalid');
    else input.setAttribute('aria-invalid', 'true');
    if (lastReport === message) return;
    lastReport = message;
    host.report(message);
    if (withSound) void audio.play(valid ? 'select' : 'error');
  };
  host.listen(input, 'change', () => { interacted = true; report(); });
  host.listen(input, 'blur', () => {
    if (!interacted && !input.required && !input.value) return;
    report();
  });
  host.listen(input, 'invalid', () => { interacted = true; report(); });
  host.listen(input, 'input', () => {
    interacted = true;
    if (lastReport && input.getAttribute('aria-invalid') === 'true') report(false);
  });
});
