import '@ui-sdk/web/password-input';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-password', host => {
  const control = host.querySelector('ui-password-input');
  if (!control) return;
  host.listen(control, 'visiblechange', event => afterChange(event, () => {
    const visible = event.detail.value;
    host.report(visible ? 'Password visible' : 'Password hidden');
    const button = control.querySelector('button');
    if (button) {
      button.textContent = visible ? 'Hide' : 'Show';
      button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    }
    void audio.play(visible ? 'on' : 'off');
  }));
});
