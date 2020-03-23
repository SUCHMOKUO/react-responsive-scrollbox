import React, { useCallback, useEffect, useRef } from "react";
import resizeObserver from "./resize-observer";
import "./style.css";
import {
  culcSize,
  rafThrottle,
  resetScrollbar,
  State,
  toFixed2,
} from "./utils";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function ScrollBox(props: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const viewPortRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const vTrackRef = useRef<HTMLDivElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const vThumbRef = useRef<HTMLDivElement>(null);
  const hThumbRef = useRef<HTMLDivElement>(null);
  const state = useRef<State>({
    viewPortHeight: 0,
    viewPortWidth: 0,
    contentHeight: 0,
    contentWidth: 0,
    vRatio: 0,
    hRatio: 0,
    vTrackHeight: 0,
    hTrackWidth: 0,
    vThumbHeight: 0,
    hThumbWidth: 0,
    maxVThumbTop: 0,
    maxHThumbLeft: 0,
    startCursorY: 0,
    startCursorX: 0,
    startVThumbTop: 0,
    startHThumbLeft: 0,
    currentVThumbTop: 0,
    currentHThumbLeft: 0,
    ignoreScrollEvent: false,
  }).current;

  const reset = useCallback(() => {
    const viewPort = viewPortRef.current as HTMLDivElement;
    const content = contentRef.current as HTMLDivElement;
    const vTrack = vTrackRef.current as HTMLDivElement;
    const hTrack = hTrackRef.current as HTMLDivElement;
    const vThumb = vThumbRef.current as HTMLDivElement;
    const hThumb = hThumbRef.current as HTMLDivElement;

    culcSize(viewPort, content, vTrack, hTrack, state);
    resetScrollbar(vTrack, vThumb, hTrack, hThumb, state);
  }, [state]);

  const draggingVThumb = useCallback(
    rafThrottle((e: MouseEvent) => {
      const cursorMoveDistance = e.y - state.startCursorY;
      state.currentVThumbTop = state.startVThumbTop + cursorMoveDistance;
      if (state.currentVThumbTop < 0) {
        state.currentVThumbTop = 0;
      }
      if (state.currentVThumbTop > state.maxVThumbTop) {
        state.currentVThumbTop = state.maxVThumbTop;
      }
      const vThumb = vThumbRef.current as HTMLDivElement;
      vThumb.style.transform = `translateY(${state.currentVThumbTop}px)`;
      const viewPort = viewPortRef.current as HTMLDivElement;
      viewPort.scrollTop = toFixed2(state.currentVThumbTop / state.vRatio);
    }),
    [state]
  );

  const stopDragVThumb = useCallback(() => {
    state.startVThumbTop = state.currentVThumbTop;
    state.ignoreScrollEvent = false;
    const vTrack = vTrackRef.current as HTMLDivElement;
    vTrack.classList.remove("visible");
    document.removeEventListener("mouseup", stopDragVThumb);
    document.removeEventListener("mousemove", draggingVThumb);
  }, [state, draggingVThumb]);

  const startDragVThumb = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      state.startCursorY = e.y;
      state.ignoreScrollEvent = true;
      const vTrack = vTrackRef.current as HTMLDivElement;
      vTrack.classList.add("visible");

      document.addEventListener("mouseup", stopDragVThumb);
      document.addEventListener("mousemove", draggingVThumb);
    },
    [state, stopDragVThumb, draggingVThumb]
  );

  const draggingHThumb = useCallback(
    rafThrottle((e: MouseEvent) => {
      const cursorMoveDistance = e.x - state.startCursorX;
      state.currentHThumbLeft = state.startHThumbLeft + cursorMoveDistance;
      if (state.currentHThumbLeft < 0) {
        state.currentHThumbLeft = 0;
      }
      if (state.currentHThumbLeft > state.maxHThumbLeft) {
        state.currentHThumbLeft = state.maxHThumbLeft;
      }
      const hThumb = hThumbRef.current as HTMLDivElement;
      hThumb.style.transform = `translateX(${state.currentHThumbLeft}px)`;
      const viewPort = viewPortRef.current as HTMLDivElement;
      viewPort.scrollLeft = toFixed2(state.currentHThumbLeft / state.hRatio);
    }),
    [state]
  );

  const stopDragHThumb = useCallback(() => {
    state.startHThumbLeft = state.currentHThumbLeft;
    state.ignoreScrollEvent = false;
    const hTrack = hTrackRef.current as HTMLDivElement;
    hTrack.classList.remove("visible");
    document.removeEventListener("mouseup", stopDragHThumb);
    document.removeEventListener("mousemove", draggingHThumb);
  }, [state, draggingHThumb]);

  const startDragHThumb = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      state.startCursorX = e.x;
      state.ignoreScrollEvent = true;
      const hTrack = hTrackRef.current as HTMLDivElement;
      hTrack.classList.add("visible");

      document.addEventListener("mouseup", stopDragHThumb);
      document.addEventListener("mousemove", draggingHThumb);
    },
    [state, stopDragHThumb, draggingHThumb]
  );

  const moveThumb = useCallback(
    rafThrottle(() => {
      const viewPort = viewPortRef.current as HTMLDivElement;
      const vThumb = vThumbRef.current as HTMLDivElement;
      const hThumb = hThumbRef.current as HTMLDivElement;
      const scrollTop = viewPort.scrollTop;
      const scrollLeft = viewPort.scrollLeft;
      state.startVThumbTop = toFixed2(scrollTop * state.vRatio);
      state.startHThumbLeft = toFixed2(scrollLeft * state.hRatio);
      vThumb.style.transform = `translateY(${state.startVThumbTop}px)`;
      hThumb.style.transform = `translateX(${state.startHThumbLeft}px)`;
    }),
    [state]
  );

  const scroll = useCallback(() => {
    if (state.ignoreScrollEvent) {
      return;
    }
    moveThumb();
  }, [state, moveThumb]);

  useEffect(() => {
    const box = boxRef.current as HTMLDivElement;
    resizeObserver.observe(box);
    box.onresize = reset;

    const vThumb = vThumbRef.current as HTMLDivElement;
    const hThumb = hThumbRef.current as HTMLDivElement;
    const viewPort = viewPortRef.current as HTMLDivElement;
    vThumb.onmousedown = startDragVThumb;
    hThumb.onmousedown = startDragHThumb;
    viewPort.onscroll = scroll;

    return () => {
      resizeObserver.unobserve(box);
      box.onresize = null;
      vThumb.onmousedown = null;
      hThumb.onmousedown = null;
      viewPort.onscroll = null;
    };
  }, [reset, startDragVThumb, startDragHThumb, scroll]);

  useEffect(reset);

  return (
    <div ref={boxRef} className={`scroll-box ${props.className ?? ""}`}>
      <div ref={viewPortRef} className="scroll-box-view-port">
        <div ref={contentRef} className="scroll-box-content">
          {props.children}
        </div>
      </div>
      <div ref={vTrackRef} className="scroll-box-track vertical">
        <div ref={vThumbRef} className="scroll-box-thumb vertical"></div>
      </div>
      <div ref={hTrackRef} className="scroll-box-track horizontal">
        <div ref={hThumbRef} className="scroll-box-thumb horizontal"></div>
      </div>
    </div>
  );
}
