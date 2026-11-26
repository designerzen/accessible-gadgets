import '@ui-sdk/web/file-input';
import { audio } from '../audio';
import { afterChange, defineFeedback } from './feedback';

defineFeedback('ag-file', host => {
  const control = host.querySelector('ui-file-input');
  if (!control) return;
  if (host.querySelector('[data-feedback]')) {
    // Avoid duplicating status updates from the SDK's internal live region.
    (control as HTMLElement & { announcement?: () => null }).announcement = () => null;
  }
  host.listen(control, 'valuechange', event => afterChange(event, () => {
    host.report(`${event.detail.value.length} file${event.detail.value.length === 1 ? '' : 's'} selected`);
    void audio.play(event.detail.value.length ? 'success' : 'off');
  }));
  host.listen(control, 'reject', (event: CustomEvent<{ value?: Array<{ reasons?: string[] }> }>) => {
    const reasons = new Set((event.detail?.value ?? []).flatMap(item => item.reasons ?? []));
    const reasonText = reasons.has('file-too-large')
      ? 'file is larger than 1 MB'
      : reasons.has('file-type')
        ? 'unsupported file type'
        : reasons.has('file-too-small')
          ? 'file is too small'
          : reasons.has('too-many-files')
            ? 'too many files selected'
            : '';
    host.report(reasonText
      ? `File not accepted: ${reasonText}. Choose a text file under 1 MB.`
      : 'File not accepted. Choose a text file under 1 MB.');
    void audio.play('error');
  });
});
