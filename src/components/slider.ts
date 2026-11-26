import '@ui-sdk/web/slider';
import '@ui-sdk/web/field';
import { audio, pulse, valuePitch } from '../audio';

let nextId = 0;

/** A light-DOM Web Component composed from UI SDK's form-associated slider. */
export class AccessibleSlider extends HTMLElement {
  static observedAttributes = ['label', 'min', 'max', 'step', 'disabled', 'read-only', 'name', 'form', 'unit'];
  private events?: AbortController;
  private built = false;
  private current = 0;
  private buttonChange = false;
  private slider!: HTMLElementTagNameMap['ui-slider'];
  private output!: HTMLElement;
  private minus!: HTMLButtonElement;
  private plus!: HTMLButtonElement;
  private announcement!: HTMLElement;

  connectedCallback() {
    if (!this.built) this.build();
    this.events = new AbortController();
    const options = { signal: this.events.signal };
    this.slider.addEventListener('valuechange', event => {
      if (event.defaultPrevented) return;
      const value = Number(event.detail.value);
      // SDK events are cancellable requests. Wait for other listeners before feedback.
      queueMicrotask(() => {
        if (event.defaultPrevented || !this.isConnected) return;
        const changed = value !== this.current;
        this.current = value;
        this.refresh();
        if (changed && event.detail.reason !== 'reset') {
          pulse(this.output);
          void audio.play('tick', valuePitch(value, this.min, this.max));
          this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
        if (this.buttonChange) this.announcement.textContent = `${this.label}: ${this.formatted}`;
        this.buttonChange = false;
      });
    }, options);
    this.slider.addEventListener('valuecommit', () => {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }, options);
    this.addEventListener('focusin', (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
      void audio.play('focus');
    }, options);
    this.minus.addEventListener('click', () => this.nudge(-1), options);
    this.plus.addEventListener('click', () => this.nudge(1), options);
    this.refresh();
  }

  disconnectedCallback() { this.events?.abort(); }
  attributeChangedCallback() { if (this.built) this.configure(); }
  get label() { return this.getAttribute('label') || 'Value'; }
  get min() { const value = Number(this.getAttribute('min') ?? 0); return Number.isFinite(value) ? value : 0; }
  get max() { const value = Number(this.getAttribute('max') ?? 100); return Number.isFinite(value) && value > this.min ? value : this.min + 100; }
  get step() { const value = Number(this.getAttribute('step') ?? 1); return Number.isFinite(value) && value > 0 ? value : 1; }
  get value() { return this.built ? Number(this.slider.value) : Number(this.getAttribute('value') ?? 50); }
  set value(value: number) {
    if (!Number.isFinite(value)) return;
    if (!this.built) { this.setAttribute('value', String(value)); return; }
    this.slider.api.setValue(value);
  }
  private formatValue(value: number) {
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 8 }).format(value)}${this.getAttribute('unit') || ''}`;
  }
  private get formatted() { return this.formatValue(this.current); }

  private build() {
    const id = `ag-slider-${++nextId}`;
    this.innerHTML = `
      <ui-field>
        <ui-slider default-value="${Number(this.getAttribute('value') ?? 50)}" min="${this.min}" max="${this.max}" step="${this.step}">
          <div class="slider-heading"><ui-field-label></ui-field-label><output class="slider-output" id="${id}-output" aria-live="off"></output></div>
          <div class="slider-row">
            <button type="button" class="step-button" data-step="minus"><span aria-hidden="true">−</span></button>
            <div class="slider-rail">
              <ui-slider-control><ui-slider-track><ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb></ui-slider-track></ui-slider-control>
              <div class="tick-marks" aria-hidden="true"></div>
              <div class="slider-scale" aria-hidden="true"><span data-min></span><span data-max></span></div>
            </div>
            <button type="button" class="step-button" data-step="plus"><span aria-hidden="true">+</span></button>
          </div>
        </ui-slider>
        <ui-field-description>Drag, use the − / + buttons, or press the arrow keys. Home / End jump to the limits.</ui-field-description>
        <span class="sr-only" aria-live="polite" aria-atomic="true" data-announcement></span>
      </ui-field>`;
    this.slider = this.querySelector('ui-slider')!;
    this.output = this.querySelector('output')!;
    this.minus = this.querySelector('[data-step="minus"]')!;
    this.plus = this.querySelector('[data-step="plus"]')!;
    this.announcement = this.querySelector('[data-announcement]')!;
    this.current = Number(this.slider.value);
    this.built = true;
    this.configure();
  }

  private configure() {
    for (const attribute of ['min', 'max', 'step', 'disabled', 'read-only', 'name', 'form']) {
      const value = this.getAttribute(attribute);
      if (value === null) this.slider.removeAttribute(attribute);
      else this.slider.setAttribute(attribute, value);
    }
    this.querySelector('ui-field-label')!.textContent = this.label;
    this.slider.format = value => this.formatValue(value);
    this.minus.setAttribute('aria-label', `Decrease ${this.label.toLowerCase()}`);
    this.plus.setAttribute('aria-label', `Increase ${this.label.toLowerCase()}`);
    this.querySelector('[data-min]')!.textContent = `${this.min}${this.getAttribute('unit') || ''}`;
    this.querySelector('[data-max]')!.textContent = `${this.max}${this.getAttribute('unit') || ''}`;
    const ticks = Math.min(21, Math.max(2, Math.floor((this.max - this.min) / this.step) + 1));
    this.querySelector('.tick-marks')!.innerHTML = '<i></i>'.repeat(ticks);
    this.current = Number(this.slider.value);
    this.refresh();
  }

  private refresh() {
    this.output.textContent = this.formatted;
    const blocked = this.hasAttribute('disabled') || this.hasAttribute('read-only') || this.matches(':disabled') || this.slider.matches(':disabled');
    const lastStep = this.min + Math.floor((this.max - this.min) / this.step + 1e-9) * this.step;
    // aria-disabled retains focus at bounds and the click handler enforces it.
    this.minus.setAttribute('aria-disabled', String(blocked || this.current <= this.min));
    this.plus.setAttribute('aria-disabled', String(blocked || this.current >= lastStep - 1e-9));
    this.minus.disabled = blocked;
    this.plus.disabled = blocked;
  }

  private nudge(direction: number) {
    if (this.slider.matches(':disabled') || this.hasAttribute('disabled') || this.hasAttribute('read-only')) return;
    const button = direction < 0 ? this.minus : this.plus;
    if (button.getAttribute('aria-disabled') === 'true') return;
    const before = this.value;
    this.buttonChange = true;
    const accepted = this.slider.api.setValue(Number((before + direction * this.step).toFixed(10)));
    if (!accepted) this.buttonChange = false;
    queueMicrotask(() => {
      if (accepted && this.value !== before) this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
  }
}

customElements.define('ag-slider', AccessibleSlider);
declare global { interface HTMLElementTagNameMap { 'ag-slider': AccessibleSlider } }
