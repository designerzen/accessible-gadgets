import { audio } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-link', host => {
  host.listen(host, 'click', event => {
    const link = (event.target as Element).closest('a');
    if (!link) return;
    host.report('Opening link');
    void audio.play('select');
  });
});
