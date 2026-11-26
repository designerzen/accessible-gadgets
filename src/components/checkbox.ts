import '@ui-sdk/web/checkbox';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-checkbox', host => {
  const checkbox = host.querySelector('ui-checkbox');
  if (!checkbox) return;
  host.listen(checkbox, 'checkedchange', event => afterChange(event, () => {
    const checked = event.detail.value;
    const mixed = checked === 'indeterminate' || checked === 'mixed';
    host.report(mixed ? 'Partially selected' : checked ? 'Selected' : 'Not selected');
    void audio.play(mixed ? 'select' : checked ? 'on' : 'off');
  }));
});
