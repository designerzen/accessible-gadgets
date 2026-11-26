import '@ui-sdk/web/meter';
import { audio, valuePitch } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-meter', host => {
  const control = host.querySelector('ui-meter');
  if (!control) return;
  host.listen(host, 'announce', () => {
    const value = Number(control.getAttribute('value') ?? 0);
    const minAttr = Number(control.getAttribute('min') ?? 0);
    const maxAttr = Number(control.getAttribute('max') ?? 100);
    const min = Number.isFinite(minAttr) ? minAttr : 0;
    const max = Number.isFinite(maxAttr) && maxAttr > min ? maxAttr : min + 100;
    const percent = Math.round(Math.max(0, Math.min(1, (value - min) / (max - min))) * 100);
    host.report(`${percent}% used`);
    void audio.play('tick', valuePitch(value, min, max));
  });
});
