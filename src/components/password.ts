import '@ui-sdk/web/password-input';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-password', host => {
  const control = host.querySelector('ui-password-input');
  if (!control) return;
  const capsLock = host.querySelector<HTMLElement>('[data-caps-lock]');
  const updateCapsLock = () => {
    if (!capsLock) return;
    const message = control.hasAttribute('data-capslock') ? 'Caps Lock is on' : '';
    if (capsLock.textContent !== message) capsLock.textContent = message;
  };
  updateCapsLock();
  if (capsLock) {
    const observer = new MutationObserver(updateCapsLock);
    observer.observe(control, { attributes: true, attributeFilter: ['data-capslock'] });
    host.signal.addEventListener('abort', () => observer.disconnect(), { once: true });
  }
  host.listen(control, 'visiblechange', event => afterChange(event, () => {
    const visible = Boolean(event.detail.value);
    host.report(visible ? 'Password visible' : 'Password hidden');
    void audio.play(visible ? 'on' : 'off');
  }));
});
