import '@ui-sdk/web/radio';
import { audio, valuePitch } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-radio', host => {
  const group = host.querySelector('ui-radio-group');
  if (!group) return;
  host.listen(group, 'valuechange', event => afterChange(event, () => {
    const radios = [...group.querySelectorAll('ui-radio')];
    const index = radios.findIndex(radio => radio.getAttribute('value') === event.detail.value);
    const label = radios[index]?.closest('label')?.textContent?.trim() ?? 'No selection';
    host.report(`${label} selected`);
    void audio.play('tick', valuePitch(index, 0, radios.length - 1));
  }));
});
