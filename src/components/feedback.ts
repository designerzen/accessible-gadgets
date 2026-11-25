import { audio, pulse } from '../audio';

export type FeedbackHost = HTMLElement & { listen: (target: EventTarget, event: string, handler: (event: any) => void, capture?: boolean) => void; report: (text: string) => void };

/** Preserve native/SDK form and keyboard semantics; enhance through DOM events. */
export function defineFeedback(tag: string, connect: (host: FeedbackHost) => void) {
  class FeedbackElement extends HTMLElement {
    private events?: AbortController;
    private status?: HTMLElement;
    connectedCallback() {
      this.events?.abort();
      this.events = new AbortController();
      this.status = this.querySelector<HTMLElement>('[data-feedback]') ?? undefined;
      this.listen(this, 'focusin', (event: FocusEvent) => {
        if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
        void audio.play('focus');
      });
      connect(this);
    }
    disconnectedCallback() { this.events?.abort(); }
    listen(target: EventTarget, event: string, handler: (event: any) => void, capture = false) {
      target.addEventListener(event, handler, { capture, signal: this.events!.signal });
    }
    report(text: string) {
      if (this.status) this.status.textContent = text;
      pulse(this);
      this.dispatchEvent(new CustomEvent('feedback', { detail: { text }, bubbles: true, composed: true }));
    }
  }
  customElements.define(tag, FeedbackElement);
}

// A change event is a cancellable request, so report only after it is accepted.
export function afterChange(event: Event, action: () => void) {
  queueMicrotask(() => { if (!event.defaultPrevented) action(); });
}
