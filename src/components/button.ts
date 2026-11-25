import '@ui-sdk/web/button';
import { audio } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-button', host => {
  const button = host.querySelector('ui-button');
  if (!button) return;
  host.listen(button, 'action', () => {
    host.report('Activated');
    void audio.play('press');
  });
});
