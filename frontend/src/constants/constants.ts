const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready_search",
} as const;

export type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

const BUTTON_TEXT = {
  UPLOAD: "Upload file",
  UPLOADING: "Uploading...",
} as const;

const DEBOUNCE_DELAY = 300;

export { APP_STATUS, BUTTON_TEXT, DEBOUNCE_DELAY };
