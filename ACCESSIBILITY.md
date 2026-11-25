# Accessibility testing

## Target and current status

The engineering target is **WCAG 2.2 Level AA with the enhanced AAA criteria listed below**, informed by Apple's iOS/iPadOS accessibility guidance, for the complete index and all 17 live component test pages in the default monochrome theme. This includes the applicable Level A and AA criteria from earlier WCAG versions. This document is a testing record, **not a conformance declaration or certification**. A passing automated build does not establish full WCAG conformance. No claim of universal accessibility or complete Level AAA conformance is made.

References: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C guidance on evaluation tools and human judgment](https://www.w3.org/WAI/test-evaluate/tools/selecting/).

## Automated checks

Run `pnpm test`, then `pnpm build`, `pnpm test:built`, and `pnpm test:ios`. GitHub Actions runs these checks and retains separate Playwright reports on successful and failed runs. axe scans use `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, `wcag2aaa` and best-practice rules without disabling individual rules. A violation fails the build. axe currently exposes its AAA rules under `wcag2aaa`; newer AAA focus and target criteria also need the explicit checks below.

| Area | Evidence and implementation | Relevant criteria |
| --- | --- | --- |
| Names, roles, labels and states | UI SDK/native semantics; axe on the index, every page, and states after interaction; password visibility and selection-state tests | 1.1.1, 1.3.1, 2.4.6, 2.5.3, 4.1.2 |
| Keyboard use | Slider keys and step buttons, checkbox/switch Space, radio arrows, popup open/Escape/focus return, disclosure Enter, native input editing | 2.1.1, 2.1.2, 2.4.3 |
| Bypass navigation | Skip link receives keyboard focus, moves focus to the component area, and permits forward tabbing into its content | 2.4.1 |
| Text contrast | axe contrast rules for the default theme, including changed and open states | 1.4.3 |
| Non-text contrast | Visible monochrome boundaries and focus outlines; forced-color state and outline assertions. Automated axe does not establish all non-text contrast relationships | 1.4.11, 2.4.7, 2.4.11 |
| Reflow and text spacing | All 18 pages at a 320 CSS-pixel viewport with line height 1.5, letter spacing .12em, word spacing .16em and paragraph spacing 2em; no horizontal page overflow | 1.4.10, 1.4.12 |
| Target size | Index and every component page measured against the enhanced 44×44 CSS-pixel minimum, counting associated labels and visible file-picker triggers as effective targets; actual label taps and step-button taps checked in WebKit | 2.5.5 (AAA), 2.5.8 |
| Drag alternatives | Slider step buttons, keyboard and direct track presses; number input text/step buttons; file browse button alongside drop zone | 2.5.1, 2.5.7 |
| Errors and suggestions | Required-field error state and accessible description persist; correction clears invalid state; file acceptance/rejection tests | 3.3.1, 3.3.2, 3.3.3 |
| Status messages | Polite visible status regions; button-based slider changes announced separately; textarea visible count updates per key but announces on blur and near/at capacity | 4.1.3 |
| Optional sound | Off initially; independent volume and mute; real Web Audio synthesis tested; no information depends solely on sound or pitch | 1.3.3, 1.4.2 |
| Reduced motion / high contrast | Visual pulses disabled for reduced motion; forced-color control states and visible focus tested | 1.4.11; also supports the intent of 2.3.3 (AAA) |
| File privacy and native controls | Files remain local; standard picker/button route; native date/time/color pickers retain platform behavior | Requires native-platform testing below |

320 CSS pixels models the reflow width of a 1280-pixel viewport at 400% browser zoom. It does **not** replace checking real browser zoom, text-only resizing, clipping, or reading order. Target dimensions and computed focus styles similarly supplement visual inspection; they are not a complete evaluation of every criterion.

## Required manual evaluation before a conformance claim

These checks remain **unverified**. Do not mark them passed based on axe or the browser DOM tests.

1. **Screen readers:** Test each page with NVDA + Firefox/Chrome on Windows, VoiceOver + Safari on macOS/iOS, and TalkBack + Chrome on Android. Check accessible names, roles, current values, required/invalid state, descriptions, selection, popup navigation, form resets and error messages. Check slider adjustments through mobile assistive-technology gestures.
2. **Announcements:** Listen for duplicate, missed or disruptive announcements during typing, repeated step-button presses, file selection/removal, password reveal, and progress updates. Confirm a screen reader remains understandable with optional sound enabled.
3. **Keyboard and focus:** Complete every example with Tab, Shift+Tab and component keys, without a pointer. Verify logical reading/focus order, no traps, no obscured focus, and visible focus at every step, including popup items and native dialogs.
4. **Zoom and resizing:** Test actual browser zoom at 200% and 400%, text-only resizing at 200%, landscape/portrait, and user fonts/styles. Inspect content and control text for overlap or clipping, not only page overflow. Check the native pickers at each zoom level.
5. **Pointer and touch:** Test touch targets and pointer cancellation on real devices, including track presses, drag cancellation, clicking labels, and using every non-drag alternative. Confirm inputs do not depend on path-based gestures.
6. **Visual inspection:** Confirm state and focus contrast, readability, selection visibility, forced-color mode, and focus not obscured. Test any OKLCH accent overrides against text and non-text contrast requirements; custom themes are not covered by the default-theme results.
7. **Sound and motion:** Listen at realistic volumes and with hearing-assistance setups. Verify immediate mute, independent volume, comfortable cue levels, silence before opt-in, no essential auditory-only information, and reduced-motion behavior.
8. **Understanding and usability:** Have people with disabilities evaluate labels, instructions, task completion, errors and recovery. A complete WCAG-EM review must also assess criteria that cannot be meaningfully decided by this test suite.

Record the browser/OS/assistive-technology versions, date, pages/states tested, results and unresolved issues when performing these checks. Automated coverage includes Chromium and Playwright WebKit with iPhone/iPad device emulation. Firefox and actual assistive-technology interoperability are not yet verified.

## Apple iOS guidance and enhanced AAA checks

Apple publishes [accessibility Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility); WCAG defines the A/AA/AAA conformance levels. There is no separate Apple "iOS AAA" certification being claimed here. Apple's native dimensions are in points; these web tests deliberately enforce 44×44 **CSS pixels** at the default viewport, not 44 hardware pixels or a universal conversion between native points and CSS pixels.

| Consideration | Implemented and automated coverage | Limit of the evidence |
| --- | --- | --- |
| [Enhanced target size, 2.5.5 AAA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | 44×44 effective targets for links, controls and popup options; a 44px slider hit area with a smaller decorative thumb; non-shrinking quantity buttons; label taps outside checkbox marks | Actual device accuracy, touch accommodations and OS picker targets need manual checks |
| [Enhanced contrast, 1.4.6 AAA](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html) | axe enhanced text-contrast rules on initial and changed states in Chromium and WebKit: 7:1 for ordinary text, 4.5:1 for large text; darker secondary text on tinted surfaces | Custom token overrides require reassessment; axe incomplete results still need human judgment |
| [Focus appearance, 2.4.13 AAA](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) and unobscured focus 2.4.12 AAA | Default 3px focus outlines; WebKit checks the slider's outline size and full viewport visibility under increased contrast; popup focus-return checks | This does not geometrically certify every focus-indicator pixel or rule out every occlusion; visually inspect all focus stops on real devices |
| Interaction motion, 2.3.3 AAA | Reduced-motion preference suppresses feedback pulses, with WebKit assertions | Test actual iOS Reduce Motion mapping and comfort on hardware |
| Larger text and zoom | Relative text units; Safari's system body text style where supported; input text at least 16px; doubled root text plus expanded spacing across all 18 pages; no author-imposed zoom limits; slider allows vertical scroll and pinch zoom | Root text enlargement is a proxy, not a test of actual iOS Dynamic Type, Larger Text, Safari Page Zoom, keyboard auto-zoom or pinch gestures |
| Simple gestures and multimodal feedback | Tap alternatives to slider dragging and file dropping; WebKit touch selection and popup tests; audio unlock by touch and mute tests; visual feedback continues when muted | WebKit touch emulation does not run VoiceOver, Switch Control, Voice Control, AssistiveTouch or native haptics |

`playwright.ios.config.ts` runs the built site under `/accessible-gadgets/` using WebKit with iPhone 13 portrait and iPad Mini landscape profiles. These simulate viewport, touch and browser/device characteristics. **They do not run Safari on an iPhone/iPad and do not establish an iOS accessibility pass.** Failed runs retain screenshots and traces. See [Playwright's emulation](https://playwright.dev/docs/emulation) and [WebKit support](https://playwright.dev/docs/browsers#webkit).

Local Windows WebKit 27.2 exposes neither `AudioContext` nor `OfflineAudioContext`. The mobile suite therefore explicitly tests and annotates its unavailable-audio fallback here, rather than mocking Web Audio or recording a synthesis pass. CI runs this suite in a separate **macOS WebKit** job with `AG_REQUIRE_WEB_AUDIO=1`; that job fails if real Web Audio is unavailable and otherwise checks synthesis activation by touch and muting. Deployment waits for both Chromium and macOS WebKit jobs. The macOS job has not been executed in this Windows workspace, and even its success would not verify hardware Safari or VoiceOver.

### Real iPhone/iPad acceptance checklist — not yet executed

- Record hardware, iOS/iPadOS version, Safari version, text size and assistive technology settings for every result.
- With VoiceOver, navigate by headings and form controls, activate every example, adjust sliders using VoiceOver's adjustable-control gestures, and verify names, roles, values, announcements, errors and focus after closing native dialogs. Confirm no duplicated or overwhelming speech when sounds are enabled.
- Test Larger Text at large accessibility sizes, Bold Text, Safari Page Zoom at 200%, pinch zoom, both orientations, display cutouts and the software keyboard. Inspect clipped values, covered controls, scroll position and text entry in the date/time/color pickers.
- Test Increase Contrast, Reduce Motion, Invert Colors and color filters. Ensure selected states and focus remain recognizable. A CSS media-query emulation pass is not evidence that every iOS setting maps correctly.
- Exercise Voice Control names, Switch Control scanning, Full Keyboard Access, AssistiveTouch and Touch Accommodations. Check tap accuracy, cancellation, repeat handling and the non-drag alternatives.
- Check Web Audio with the real silent switch, headphones, background/foreground transitions and VoiceOver speech. Confirm opt-in, immediate mute, comfortable volume, and uninterrupted visual feedback. Native haptic feedback is not implemented or relied upon.
- Record issues and rerun after corrections. The baseline manual checks above still apply; these added tests do not establish full AAA conformance. Criteria involving other content, such as prerecorded speech/media, authentication, timing and reading complexity, need their own applicability review if introduced.

## Scope notes

- Default component examples have no prerecorded media, captions, timed task completion, authentication process, payment flow or irreversible data submission. Criteria concerning those features need reassessment if the consuming application introduces them.
- The host application remains responsible for meaningful labels, content, form instructions, error recovery, focus management and contrast of custom themes. Tokens cannot prevent a consuming page from choosing inaccessible colors or hiding content.
- Native operating-system pickers and third-party UI SDK behavior need testing on the browsers and assistive technologies used by the audience; retaining native semantics is not proof of compatibility.
