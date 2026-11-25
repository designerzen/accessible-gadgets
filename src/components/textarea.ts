import '@ui-sdk/web/textarea';
import { audio } from '../audio';
import { defineFeedback } from './feedback';

defineFeedback('ag-textarea', host => {
  const textarea = host.querySelector('textarea');
  if (!textarea) return;
  // Keep the visible count live without making a screen reader speak each key.
  const count = host.querySelector<HTMLElement>('[data-feedback]');
  if (count) {
    count.removeAttribute('role');
    count.setAttribute('aria-live', 'off');
  }
  let announcement = host.querySelector<HTMLElement>('[data-count-announcement]');
  if (!announcement) {
    announcement = document.createElement('span');
    announcement.className = 'sr-only';
    announcement.dataset.countAnnouncement = '';
    announcement.setAttribute('role', 'status');
    host.append(announcement);
  }
  host.listen(textarea, 'input', () => {
    host.report(`${textarea.value.length}${textarea.maxLength >= 0 ? ` / ${textarea.maxLength}` : ''} characters`);
    // New-line and capacity cues avoid playing sound for every keystroke.
    if (textarea.value.length === textarea.maxLength) {
      announcement.textContent = `Character limit reached: ${textarea.maxLength} characters.`;
      void audio.play('error');
    } else if (textarea.maxLength > 0 && textarea.maxLength - textarea.value.length === 20) {
      announcement.textContent = '20 characters remaining.';
    }
  });
  host.listen(textarea, 'blur', () => { announcement.textContent = count?.textContent || ''; });
  host.listen(textarea, 'keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.isComposing) void audio.play('select');
  });
});
