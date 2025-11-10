// 이벤트 타입
export const EVENT_TYPES = {
  CLICK: "click",
  POPSTATE: "popstate",
  LOAD: "load",
  ERROR: "error",
  SCROLL: "scroll",
  RESIZE: "resize",
  KEYDOWN: "keydown",
  KEYUP: "keyup",
  FOCUS: "focus",
  BLUR: "blur",
} as const;

// 이벤트 옵션
export const EVENT_OPTIONS = {
  ONCE: { once: true },
  PASSIVE: { passive: true },
  CAPTURE: { capture: true },
} as const;
