import '@ui-sdk/web/progress';
import { audio, valuePitch } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-progress', host => {
  const control = host.querySelector('ui-progress');
  if (!control) return;
  // Passive progress must not make unsolicited noise. Sound only after opting in
  // with an explicit, user-generated `announce` event on the wrapper.
  host.listen(host, 'announce', () => {
    const value = Number(control.getAttribute('value') ?? 0);
    host.report(value >= 100 ? 'Complete' : `${value}% complete`);
    void audio.play(value >= 100 ? 'success' : 'tick', valuePitch(value, 0, 100));
  });
});
