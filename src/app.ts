import { renderAccessibilityBreakdown, type ComponentSlug } from './accessibility-notes';
import { audio } from './audio';
import { renderCollection } from './collection';
import { componentPages, escapeHtml, renderComponentDocs } from './pages';
import { colorModes, theme, themes, type ColorMode, type ThemeId } from './theme';

let currentEvents: AbortController | undefined;

export function renderApp(root: HTMLElement, slug?: string) {
  currentEvents?.abort();
  currentEvents = new AbortController();
  const { signal } = currentEvents;

  theme.apply();

  const index = slug ? componentPages.findIndex(page => page.slug === slug) : -1;
  const componentPage = index >= 0 ? componentPages[index] : undefined;
  const home = componentPage ? '../../' : './';
  const sliderPage = componentPages[0];
  const isSliderPage = componentPage?.slug === 'slider';
  const showSlider = !componentPage || isSliderPage;

  const activeTheme = theme.themeId;
  const activeMode = theme.colorMode;

  const themeOptions = themes
    .map(entry => `<option value="${entry.id}"${entry.id === activeTheme ? ' selected' : ''}>${escapeHtml(entry.label)}</option>`)
    .join('');

  const modeButtons = colorModes
    .map(mode => `<button type="button" data-color-mode="${mode.id}" aria-pressed="${String(mode.id === activeMode)}">${escapeHtml(mode.label)}</button>`)
    .join('');

  const introMarkup = componentPage
    ? `<section class="intro" aria-labelledby="page-title">
        <a class="back-link" href="${home}">← All components</a>
        <div class="page-title-row">
          <h1 id="page-title">${escapeHtml(componentPage.title)}</h1>
          <code class="component-tag">${escapeHtml(componentPage.tag)}</code>
        </div>
        <p class="page-description">${escapeHtml(componentPage.description)}</p>
      </section>`
    : `<section class="intro" aria-labelledby="page-title">
        <div class="eyebrow"><span class="status-dot" aria-hidden="true"></span> WEB COMPONENTS · UI SDK · WEB AUDIO</div>
        <h1 id="page-title">Accessible Gadgets</h1>
        <p class="page-description">17 accessible web controls built on UI SDK and native HTML inputs, paired with visible status regions, theme modes, and optional button-synth audio cues.</p>
      </section>`;

  const sliderMarkup = showSlider
    ? `<article class="widget-card slider-card" id="slider" tabindex="-1">
        ${!componentPage ? `
          <div class="card-header">
            <div>
              <h3>${escapeHtml(sliderPage.title)}</h3>
              <span class="component-primitive">${escapeHtml(sliderPage.primitive)}</span>
            </div>
            <code class="component-tag">${escapeHtml(sliderPage.tag)}</code>
          </div>
          <p class="card-description">${escapeHtml(sliderPage.description)}</p>
        ` : ''}
        <ag-slider label="Intensity" value="50" min="0" max="100" step="1" unit="%" name="intensity"></ag-slider>
        ${!componentPage ? `
          <details class="card-code">
            <summary>Code example</summary>
            <pre class="code-block"><code>${escapeHtml(sliderPage.code)}</code></pre>
          </details>
          <div class="card-footer">
            <code>${escapeHtml(sliderPage.tag)}</code>
            <a class="test-page-link" href="./components/slider/">Open ${escapeHtml(sliderPage.title)} test page <span aria-hidden="true">↗</span></a>
          </div>
        ` : ''}
      </article>`
    : '';

  const collectionHeadingMarkup = componentPage
    ? `<div class="section-heading">
        <h2 id="components-title">Live example</h2>
        <button id="reset-example" type="button">Reset example</button>
      </div>`
    : `<div class="section-heading">
        <h2 id="components-title">Components</h2>
        <span class="collection-count">${componentPages.length} components</span>
      </div>`;

  const directoryMarkup = !componentPage
    ? `<nav class="component-directory" aria-labelledby="directory-title">
        <h2 id="directory-title">Component test pages</h2>
        <p>Open any control in its own page with API specs, copyable code, manual checks, and accessibility notes.</p>
        <div>
          ${componentPages.map(page => `<a href="./components/${page.slug}/"><span>${escapeHtml(page.title)}</span><code aria-hidden="true">${escapeHtml(page.tag)}</code></a>`).join('')}
        </div>
      </nav>`
    : '';

  const componentExtrasMarkup = componentPage
    ? `${renderComponentDocs(componentPage)}
      <section class="test-checklist" aria-labelledby="checklist-title">
        <h2 id="checklist-title">Things to check</h2>
        <ul>${componentPage.checks.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      ${renderAccessibilityBreakdown(componentPage.slug as ComponentSlug)}
      <nav class="page-navigation" aria-label="Component pages">
        ${index > 0
          ? `<a href="../${componentPages[index - 1].slug}/">← ${escapeHtml(componentPages[index - 1].title)}</a>`
          : '<span></span>'}
        <a href="${home}">Component index</a>
        ${index < componentPages.length - 1
          ? `<a href="../${componentPages[index + 1].slug}/">${escapeHtml(componentPages[index + 1].title)} →</a>`
          : '<span></span>'}
      </nav>`
    : '';

  root.innerHTML = `
    <header class="site-header">
      <a class="wordmark" href="${home}"><span class="brand-mark" aria-hidden="true">a<span>g</span></span>accessible gadgets</a>
      <a class="source-link" href="https://github.com/designerzen/button-synth">button-synth engine <span aria-hidden="true">↗</span></a>
    </header>
    <main>
      ${introMarkup}
      <section class="preferences-bar" aria-label="Appearance and sound preferences">
        <div class="theme-preferences">
          <label class="theme-label" for="theme-select">
            <span>Theme</span>
            <select id="theme-select">${themeOptions}</select>
          </label>
          <div class="mode-field">
            <span class="preference-label" id="color-mode-label">Color mode</span>
            <div class="mode-group" role="group" aria-labelledby="color-mode-label">${modeButtons}</div>
          </div>
          <span id="theme-status" class="sr-only" role="status" aria-atomic="true"></span>
        </div>
        <div class="sound-actions">
          <label class="volume-label">
            <span class="volume-label-row"><span>Cue volume</span><span class="volume-readout" aria-hidden="true"></span></span>
            <input id="cue-volume" aria-label="Cue volume" type="range" min="0" max="1" step="0.05">
          </label>
          <button id="sound-toggle" type="button" class="sound-button" aria-pressed="false">Sound cues <span aria-hidden="true">Off</span></button>
          <span id="audio-status" class="sr-only" role="status" aria-atomic="true"></span>
        </div>
      </section>
      <section id="playground" class="playground" aria-labelledby="components-title">
        ${directoryMarkup}
        ${collectionHeadingMarkup}
        ${sliderMarkup}
        <div id="more-widgets" class="${componentPage && !isSliderPage ? 'widget-grid single-widget' : 'widget-grid'}"></div>
      </section>
      ${componentExtrasMarkup}
    </main>
    <footer class="site-footer">
      <span>Accessible Gadgets</span>
      <span>Web Components · UI SDK · Web Audio</span>
    </footer>
  `;

  document.title = componentPage
    ? `${componentPage.title} test — Accessible Gadgets`
    : 'Accessible Gadgets — Accessible Web Components';

  const widgetsContainer = root.querySelector<HTMLElement>('#more-widgets')!;
  if (isSliderPage) {
    widgetsContainer.hidden = true;
  } else {
    renderCollection(widgetsContainer, componentPage?.slug, componentPage ? '../' : './', signal);
  }

  const themeSelect = root.querySelector<HTMLSelectElement>('#theme-select')!;
  const modeButtonEls = [...root.querySelectorAll<HTMLButtonElement>('[data-color-mode]')];
  const themeStatus = root.querySelector<HTMLElement>('#theme-status')!;

  themeSelect.addEventListener('change', () => {
    const nextTheme = themeSelect.value as ThemeId;
    theme.setTheme(nextTheme);
    const label = themes.find(entry => entry.id === nextTheme)?.label ?? nextTheme;
    themeStatus.textContent = `${label} theme selected.`;
  }, { signal });

  for (const button of modeButtonEls) {
    button.addEventListener('click', () => {
      const nextMode = button.dataset.colorMode as ColorMode;
      theme.setColorMode(nextMode);
      for (const peer of modeButtonEls) {
        peer.setAttribute('aria-pressed', String(peer.dataset.colorMode === nextMode));
      }
      const label = colorModes.find(mode => mode.id === nextMode)?.label ?? nextMode;
      themeStatus.textContent = `${label} color mode selected.`;
    }, { signal });
  }

  const copyButton = root.querySelector<HTMLButtonElement>('[data-copy-code]');
  const codeSource = root.querySelector<HTMLElement>('[data-code-source]');
  const copyStatus = root.querySelector<HTMLElement>('[data-copy-status]');
  copyButton?.addEventListener('click', async () => {
    const text = codeSource?.textContent ?? '';
    try {
      await navigator.clipboard?.writeText(text);
      if (copyStatus) copyStatus.textContent = 'Code copied to clipboard.';
      copyButton.textContent = 'Copied';
      setTimeout(() => {
        if (!signal.aborted) copyButton.textContent = 'Copy code';
      }, 2000);
    } catch {
      if (copyStatus) copyStatus.textContent = 'Copy unavailable; select code manually.';
    }
  }, { signal });

  const volume = root.querySelector<HTMLInputElement>('#cue-volume')!;
  const volumeReadout = root.querySelector<HTMLElement>('.volume-readout')!;
  const soundToggle = root.querySelector<HTMLButtonElement>('#sound-toggle')!;
  const audioStatus = root.querySelector<HTMLElement>('#audio-status')!;

  const syncAudio = (announce = false) => {
    const percent = `${Math.round(audio.volume * 100)}%`;
    volume.value = String(audio.volume);
    volumeReadout.textContent = percent;
    volume.setAttribute('aria-valuetext', percent);
    soundToggle.setAttribute('aria-pressed', String(audio.enabled));
    soundToggle.querySelector('span')!.textContent = audio.enabled ? 'On' : 'Off';

    if (audio.unavailable) {
      audioStatus.textContent = audio.enabled
        ? 'Sound cues requested, but Web Audio API is unavailable; visual feedback remains active.'
        : 'Sound cues off.';
    } else if (announce) {
      audioStatus.textContent = audio.enabled ? `Sound cues on at ${percent} volume.` : 'Sound cues off.';
    }
  };

  syncAudio(false);
  audio.addEventListener('settingschange', () => syncAudio(false), { signal });

  volume.addEventListener('input', () => {
    audio.setVolume(Number(volume.value));
  }, { signal });
  volume.addEventListener('change', () => {
    syncAudio(true);
    if (audio.enabled) void audio.play('tick', 0);
  }, { signal });

  soundToggle.addEventListener('click', () => {
    audio.setEnabled(!audio.enabled);
    syncAudio(true);
    if (audio.enabled) void audio.play('success');
  }, { signal });

  root.querySelector('#reset-example')?.addEventListener('click', () => {
    renderApp(root, slug);
    root.querySelector<HTMLElement>('#reset-example')?.focus();
  }, { signal });

  const skipLink = document.querySelector<HTMLAnchorElement>('.skip-link');
  const playground = root.querySelector<HTMLElement>('#playground');
  if (skipLink && playground) {
    playground.tabIndex = -1;
    skipLink.addEventListener('click', () => {
      queueMicrotask(() => playground.focus());
    }, { signal });
  }

  return {
    dispose: () => currentEvents?.abort(),
  };
}
