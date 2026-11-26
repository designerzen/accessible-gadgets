import '@ui-sdk/web/button';
import { audio } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-button', host => {
  const button = host.querySelector('ui-button');
  if (!button) return;
  let count = 0;
  host.listen(button, 'action', () => {
    count += 1;
    host.report(count === 1 ? 'Activated' : `Activated (${count})`);
    void audio.play('press');
  });
});
