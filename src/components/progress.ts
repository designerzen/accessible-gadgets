import '@ui-sdk/web/progress';
import { audio, valuePitch } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-progress', host => {
  const control = host.querySelector('ui-progress');
  if (!control) return;
  // Passive progress must not make unsolicited noise. Sound only after opting in
  // with an explicit, user-generated `announce` event on the wrapper.
  host.listen(host, 'announce', () => {
    const raw = control.getAttribute('value');
    const minAttr = Number(control.getAttribute('min') ?? 0);
    const maxAttr = Number(control.getAttribute('max') ?? 100);
    const min = Number.isFinite(minAttr) ? minAttr : 0;
    const max = Number.isFinite(maxAttr) && maxAttr > min ? maxAttr : min + 100;
    if (raw === null) {
      host.report('In progress');
      void audio.play('tick', 0);
      return;
    }
    const num = Number(raw);
    const percent = Math.round(Math.max(0, Math.min(1, (num - min) / (max - min))) * 100);
    host.report(num >= max ? 'Complete' : `${percent}% complete`);
    void audio.play(num >= max ? 'success' : 'tick', valuePitch(num, min, max));
  });
});
