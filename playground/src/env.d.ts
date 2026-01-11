/// <reference types="astro/client" />

interface ThemeState {
  theme: string;
  resolvedTheme: string;
  systemTheme: "dark" | "light";
  forcedTheme?: string;
  themes: string[];
  setTheme: (theme: string | ((prevTheme: string) => string)) => void;
}

declare global {
  interface Window {
    __ASTRO_THEMES__?: ThemeState;
  }
}

export {};
