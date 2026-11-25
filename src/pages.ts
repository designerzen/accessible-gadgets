export const componentPages = [
  { slug: 'slider', title: 'Slider', card: 'slider', checks: ['Drag the thumb and check that the value updates before releasing.', 'Use − / +, arrow keys, Home and End. Confirm the controls stop at the limits.', 'Enable sound and compare the low, middle and high pitches.'] },
  { slug: 'button', title: 'Button', card: 'ag-button-02', checks: ['Activate the button with a click, Enter and Space.', 'Check that Activated appears after every press.', 'Enable sound and listen for the soft click.'] },
  { slug: 'checkbox', title: 'Checkbox', card: 'ag-checkbox-03', checks: ['Click the checkbox and its text label.', 'Focus the checkbox and press Space to toggle it.', 'Check the visible check, status text and distinct on/off sounds.'] },
  { slug: 'switch', title: 'Switch', card: 'ag-switch-04', checks: ['Click the switch or its label to change the setting.', 'Use Space to toggle it from the keyboard.', 'Confirm that thumb position, On / Off text and sound agree.'] },
  { slug: 'radio', title: 'Radio group', card: 'ag-radio-05', checks: ['Select each frequency and confirm only one option is selected.', 'Tab into the group, then use the arrow keys.', 'Enable sound and compare pitches across the options.'] },
  { slug: 'select', title: 'Select', card: 'ag-select-06', checks: ['Open the list and choose an option.', 'Use the keyboard to open, navigate and select; Escape should dismiss the list.', 'Check the selected label, status and pitch feedback.'] },
  { slug: 'input', title: 'Text input', card: 'ag-input-07', checks: ['Type a display name, then Tab out to commit it.', 'Check that Value accepted appears.', 'Clear the field and commit again; check the empty state.'] },
  { slug: 'number', title: 'Number input', card: 'ag-number-08', checks: ['Type a quantity and commit it with Enter.', 'Try both step buttons and the up/down arrow keys.', 'Check that values stay between 1 and 10 and pitch rises with the value.'] },
  { slug: 'textarea', title: 'Textarea', card: 'ag-textarea-09', checks: ['Type, paste and delete text; check the live character count.', 'Enable sound and press Enter for a new-line cue.', 'Reach the 200-character limit and check the capacity feedback.'] },
  { slug: 'password', title: 'Password input', card: 'ag-password-10', checks: ['Enter a demo password, then use Show and Hide.', 'Check that visibility status and button labels track the actual state.', 'Use the keyboard to toggle visibility and listen for distinct cues.'] },
  { slug: 'file', title: 'File input', card: 'ag-file-11', checks: ['Choose or drop a text file smaller than 1 MB.', 'Confirm the file name and accepted status, then remove it.', 'Try an image or oversized file and check rejection feedback.'] },
  { slug: 'details', title: 'Details and summary', card: 'ag-details-12', checks: ['Open and close the panel with a pointer.', 'Focus the summary and use Enter or Space.', 'Confirm the panel, expanded state, status and audio agree.'] },
  { slug: 'progress', title: 'Progress', card: 'ag-progress-13', checks: ['Advance the task in 25% steps.', 'Check the live percentage and completion confirmation at 100%.', 'Reset the task and check it returns to zero.'] },
  { slug: 'meter', title: 'Meter', card: 'ag-meter-14', checks: ['Check that the visible level is 65%.', 'Enable sound and activate Read current level.', 'Check the same measurement is available to a screen reader.'] },
  { slug: 'link', title: 'Link', card: 'ag-link-15', checks: ['Tab to the link and check the focus outline.', 'Enable sound and follow the link using Enter.', 'Confirm that it opens the slider test page.'] },
  { slug: 'date-time', title: 'Date and time inputs', card: 'ag-input-16', checks: ['Choose a date and time with the native pickers or keyboard.', 'Commit each field and check its acceptance status.', 'Clear each value and check its empty state.'] },
  { slug: 'color', title: 'Color input', card: 'ag-input-17', checks: ['Open the native color picker.', 'Choose a different color and commit the selection.', 'Check the swatch, accepted status and optional sound.'] },
] as const;

export type ComponentPage = typeof componentPages[number];
