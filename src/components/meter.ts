import '@ui-sdk/web/meter';
import { audio, valuePitch } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-meter', host => {
  const control = host.querySelector('ui-meter');
  if (!control) return;
  host.listen(host, 'announce', () => {
    const value = Number(control.getAttribute('value') ?? 0);
    host.report(`${value}% used`);
    void audio.play('tick', valuePitch(value, 0, 100));
  });
});
