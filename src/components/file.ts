import '@ui-sdk/web/file-input';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-file', host => {
  const control = host.querySelector('ui-file-input');
  if (!control) return;
  host.listen(control, 'valuechange', event => afterChange(event, () => {
    host.report(`${event.detail.value.length} file${event.detail.value.length === 1 ? '' : 's'} selected`);
    void audio.play(event.detail.value.length ? 'success' : 'off');
  }));
  host.listen(control, 'reject', () => {
    host.report('File not accepted. Choose a text file under 1 MB.');
    void audio.play('error');
  });
});
