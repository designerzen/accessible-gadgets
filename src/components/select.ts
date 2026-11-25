import '@ui-sdk/web/select';
import { audio, valuePitch } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-select', host => {
  const select = host.querySelector('ui-select');
  if (!select) return;
  host.listen(select, 'valuechange', event => afterChange(event, () => {
    const items = [...select.querySelectorAll('ui-select-item')];
    const index = items.findIndex(item => item.getAttribute('value') === event.detail.value);
    host.report(`${items[index]?.textContent?.trim() ?? 'No option'} selected`);
    void audio.play('tick', valuePitch(index, 0, items.length - 1));
  }));
});
