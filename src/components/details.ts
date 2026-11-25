import '@ui-sdk/web/collapsible';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-details', host => {
  const control = host.querySelector('ui-collapsible');
  if (!control) return;
  host.listen(control, 'openchange', event => afterChange(event, () => {
    host.report(event.detail.value ? 'Details expanded' : 'Details collapsed');
    void audio.play(event.detail.value ? 'on' : 'off');
  }));
});
