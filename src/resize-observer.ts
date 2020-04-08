import { ResizeObserver as Polyfill } from "@juggle/resize-observer";

const ResizeObserver = window.ResizeObserver ?? Polyfill;

class _ResizeObserver extends ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    super(cb);
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    if (target) {
      super.observe(target, options);
    }
  }

  unobserve(target: Element) {
    if (target) {
      super.unobserve(target);
    }
  }
}

export default new _ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.dispatchEvent(
      new CustomEvent("resize", {
        bubbles: false,
      })
    );
  }
});
