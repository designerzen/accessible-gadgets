import '@ui-sdk/web/number-input';
import { audio, valuePitch } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-number', host => {
  const control = host.querySelector('ui-number-input');
  if (!control) return;
  host.listen(control, 'valuechange', event => afterChange(event, () => {
    const value = event.detail.value;
    host.report(value === null ? 'No value' : `Quantity: ${value}`);
    if (value !== null) void audio.play('tick', valuePitch(value, Number(control.getAttribute('min') ?? 0), Number(control.getAttribute('max') ?? 100)));
  }));
});
