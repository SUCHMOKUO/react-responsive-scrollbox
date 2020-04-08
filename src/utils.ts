type Func = (...args: any[]) => any;

export type State = {
  viewPortHeight: number;
  viewPortWidth: number;
  contentHeight: number;
  contentWidth: number;
  vRatio: number;
  hRatio: number;
  vTrackHeight: number;
  hTrackWidth: number;
  vThumbHeight: number;
  hThumbWidth: number;
  maxVThumbTop: number;
  maxHThumbLeft: number;
  startCursorY: number;
  startCursorX: number;
  startVThumbTop: number;
  startHThumbLeft: number;
  currentVThumbTop: number;
  currentHThumbLeft: number;
  ignoreScrollEvent: boolean;
};

export function rafThrottle<T extends Func>(fn: T) {
  let ticking = false;
  return (...args: Parameters<T>) => {
    if (ticking) {
      return;
    }
    requestAnimationFrame(() => {
      fn(...args);
      ticking = false;
    });
    ticking = true;
  };
}

export function culcSize(
  viewPort: HTMLDivElement,
  vTrack: HTMLDivElement,
  hTrack: HTMLDivElement,
  state: State
) {
  if (!viewPort || !vTrack || !hTrack) {
    return;
  }
  state.viewPortHeight = viewPort.clientHeight;
  state.contentHeight = viewPort.scrollHeight;
  state.vRatio = state.viewPortHeight / state.contentHeight;
  state.vThumbHeight = toFixed2(state.vRatio * state.viewPortHeight);
  state.vTrackHeight = vTrack.clientHeight;
  state.maxVThumbTop = state.vTrackHeight - state.vThumbHeight;

  state.viewPortWidth = viewPort.clientWidth;
  state.contentWidth = viewPort.scrollWidth;
  state.hRatio = state.viewPortWidth / state.contentWidth;
  state.hThumbWidth = toFixed2(state.hRatio * state.viewPortWidth);
  state.hTrackWidth = hTrack.clientWidth;
  state.maxHThumbLeft = state.hTrackWidth - state.hThumbWidth;
}

export function resetScrollbar(
  vTrack: HTMLDivElement,
  vThumb: HTMLDivElement,
  hTrack: HTMLDivElement,
  hThumb: HTMLDivElement,
  state: State
) {
  if (!vTrack || !vThumb || !hTrack || !hThumb) {
    return;
  }
  if (state.vThumbHeight < state.vTrackHeight) {
    vThumb.style.height = state.vThumbHeight + "px";
    vTrack.classList.remove("hiden");
  } else {
    vTrack.classList.add("hiden");
  }

  if (state.hThumbWidth < state.hTrackWidth) {
    hThumb.style.width = state.hThumbWidth + "px";
    hTrack.classList.remove("hiden");
  } else {
    hTrack.classList.add("hiden");
  }
}

export function toFixed2(n: number) {
  return Math.round(n * 100) / 100;
}
