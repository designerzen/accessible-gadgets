import '@ui-sdk/web/select';
import { audio, valuePitch } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-select', host => {
  const select = host.querySelector('ui-select');
  if (!select) return;
  host.listen(select, 'valuechange', event => afterChange(event, () => {
    const items = [...select.querySelectorAll('ui-select-item')];
    const index = items.findIndex(item => item.getAttribute('value') === event.detail.value);
    const item = index >= 0 ? items[index] : undefined;
    const label = item?.getAttribute('label')
      || item?.querySelector('ui-select-item-text')?.textContent?.trim()
      || item?.textContent?.trim();
    host.report(label ? `${label} selected` : 'No option selected');
    if (index >= 0) void audio.play('tick', valuePitch(index, 0, items.length - 1));
    else void audio.play('off');
  }));
});
