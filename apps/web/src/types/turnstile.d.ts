interface Turnstile {
  render: (container: HTMLElement | string, options: {
    sitekey: string;
    callback?: (token: string) => void;
    "error-callback"?: () => void;
    theme?: "light" | "dark";
    size?: "normal" | "compact";
  }) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export {};
