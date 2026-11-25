import './components/index';
import { mountCollection } from './collection';
import { audio } from './audio';
import { componentPages } from './pages';
import './style.css';

const componentPage = componentPages.find(page => page.slug === document.body.dataset.component);
const home = componentPage ? '../../' : './';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="site-header"><a class="wordmark" href="#"><span class="brand-mark" aria-hidden="true">a<span>g</span></span>accessible gadgets<span class="beta">LAB / 01</span></a><a class="source-link" href="https://github.com/designerzen/button-synth">Powered by button-synth <span aria-hidden="true">↗</span></a></header>
  <main>
    <section class="intro" aria-labelledby="page-title"><div class="eyebrow"><span class="status-dot"></span> SMALL CONTROLS. BETTER FEEDBACK.</div><h1 id="page-title">Feel every<br><em>interaction.</em></h1><div class="intro-bottom"><p>Familiar controls, with a little more clarity.<br>See the change. Hear the response. Find your flow.</p><div class="intro-note"><span aria-hidden="true">↘</span> Built for more ways<br>of getting things done.</div></div></section>
    <section class="sound-settings" aria-label="Sound preferences"><div class="sound-copy"><span class="sound-icon" aria-hidden="true">♪</span><div><strong>Make it audible</strong><p id="sound-description">Optional sound cues. Always paired with visual feedback.</p></div></div><div class="sound-actions"><label class="volume-label">Cue volume<input id="cue-volume" aria-label="Cue volume" type="range" min="0" max="1" step="0.05"></label><button id="sound-toggle" type="button" class="sound-button" aria-pressed="false">Sound off</button></div><span id="audio-status" class="sr-only" role="status"></span></section>
    <section id="playground" class="playground" aria-labelledby="components-title"><div class="section-heading"><div><div class="eyebrow">THE COMPONENT COLLECTION</div><h2 id="components-title">Made to respond.</h2></div><span class="collection-count">01 / SLIDER</span></div>
      <article class="widget-card slider-card" id="slider"><div class="card-heading"><div><span class="component-number">01 — RANGE INPUT</span><h3>A sense of scale</h3></div><span class="cue-tag">↗ Value → pitch</span></div><p class="card-description">A clear value. A precise step. A sound that rises with you.</p><ag-slider label="Intensity" value="50" min="0" max="100" step="1" unit="%" name="intensity"></ag-slider><div class="card-footer"><span><i class="small-dot"></i> Low value, low tone. High value, high tone.</span><code>&lt;ag-slider&gt;</code></div></article>
      <div id="more-widgets" class="widget-grid"></div>
    </section>
    <footer class="site-footer"><span>Good feedback makes a difference.</span><span>Web Components · UI SDK · Web Audio</span></footer>
  </main>`;

const soundToggle = document.querySelector<HTMLButtonElement>('#sound-toggle')!;
const volume = document.querySelector<HTMLInputElement>('#cue-volume')!;
function updateSoundSettings() {
  soundToggle.setAttribute('aria-pressed', String(audio.enabled));
  // A pressed toggle keeps a stable accessible name in both states.
  soundToggle.innerHTML = `Sound cues <span aria-hidden="true">${audio.enabled ? 'On' : 'Off'}</span>`;
  soundToggle.setAttribute('aria-describedby', 'sound-description');
  volume.value = String(audio.volume);
  const message = audio.unavailable
    ? 'Audio is unavailable. Visual feedback is still active.'
    : audio.enabled ? 'Sound cues enabled.' : 'Sound cues muted.';
  const status = document.querySelector('#audio-status')!;
  if (status.textContent !== message) status.textContent = message;
}
audio.addEventListener('settingschange', updateSoundSettings);
soundToggle.addEventListener('click', () => { audio.setEnabled(!audio.enabled); if (audio.enabled) void audio.play('success'); });
volume.addEventListener('input', () => { audio.setVolume(Number(volume.value)); void audio.play('tick'); });
updateSoundSettings();
// The skip link moves keyboard focus as well as the visual scroll position.
const playground = document.querySelector<HTMLElement>('#playground')!;
playground.tabIndex = -1;
document.querySelector('.skip-link')!.addEventListener('click', () => playground.focus());
mountCollection(document.querySelector('#more-widgets')!, componentPage?.card);
document.querySelector('.wordmark')!.setAttribute('href', home);
if (componentPage) {
  document.title = `${componentPage.title} test — Accessible Gadgets`;
  document.querySelector('.intro')!.innerHTML = `<a class="back-link" href="${home}">← All components</a><div class="eyebrow">LIVE COMPONENT TEST</div><h1 id="page-title">${componentPage.title}</h1><p class="page-description">Try the live example with a pointer, keyboard, and optional sound.</p>`;
  document.querySelector('#components-title')!.textContent = 'Try it out.';
  document.querySelector('.collection-count')!.textContent = `${componentPages.indexOf(componentPage) + 1} / ${componentPages.length}`;
  if (componentPage.slug !== 'slider') document.querySelector('#slider')!.remove();
  document.querySelector('#more-widgets')!.classList.add('single-widget');
  document.querySelector('#playground')!.insertAdjacentHTML('beforeend', `<section class="test-checklist" aria-labelledby="checklist-title"><h2 id="checklist-title">Things to check</h2><ul>${componentPage.checks.map(check => `<li>${check}</li>`).join('')}</ul><p>Try with sound off, reduced motion, and your screen reader too.</p><button type="button" id="reset-example">Reset example</button></section><nav class="page-navigation" aria-label="Component pages"><a href="${home}">← Component index</a><a href="../${componentPages[(componentPages.indexOf(componentPage) + 1) % componentPages.length].slug}/">Next component →</a></nav>`);
  document.querySelector('#reset-example')!.addEventListener('click', () => location.reload());
  document.querySelector('ag-link a')?.setAttribute('href', '../slider/');
} else {
  document.querySelector('.collection-count')!.textContent = '17 EXAMPLES / 15 COMPONENTS';
  document.querySelector('#playground')!.insertAdjacentHTML('afterbegin', `<nav class="component-directory" aria-label="Component test pages"><h2>Explore the test pages</h2><p>Each component has its own live example and a short checklist.</p><div>${componentPages.map(page => `<a href="./components/${page.slug}/">${page.title}<span aria-hidden="true">↗</span></a>`).join('')}</div></nav>`);
  for (const page of componentPages) {
    document.getElementById(page.card)?.querySelector('.card-footer')?.insertAdjacentHTML('beforeend', `<a class="test-page-link" href="./components/${page.slug}/">Test page ↗<span class="sr-only"> for ${page.title}</span></a>`);
  }
}
