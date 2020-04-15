import { ResizeObserver as Polyfill } from "@juggle/resize-observer";

const ResizeObserver = window.ResizeObserver ?? Polyfill;

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.dispatchEvent(
      new CustomEvent("resize", {
        bubbles: false,
      })
    );
  }
});

const observer = resizeObserver.observe;
const unobserver = resizeObserver.unobserve;

resizeObserver.observe = function(target: Element, options?: ResizeObserverOptions) {
  if (target) {
    observer.call(this, target, options);
  }
}

resizeObserver.unobserve = function(target: Element) {
  if (target) {
    unobserver.call(this, target);
  }
}

export default resizeObserver;
