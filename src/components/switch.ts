import '@ui-sdk/web/switch';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-switch', host => {
  const control = host.querySelector('ui-switch');
  if (!control) return;
  host.listen(control, 'checkedchange', event => afterChange(event, () => {
    host.report(event.detail.value ? 'On' : 'Off');
    void audio.play(event.detail.value ? 'on' : 'off');
  }));
});
