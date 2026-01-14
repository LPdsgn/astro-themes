import { defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import type { AstroThemesConfig, ThemeProviderProps } from "./types.js";

// Options schema for the integration
const optionsSchema = z
	.object({
		/**
		 * Enable the Dev Toolbar App for theme switching during development
		 * @default true
		 */
		devToolbar: z.boolean().default(true),
	})
	.default({});

export const integration = defineIntegration({
	name: "astro-themes",
	optionsSchema,
	setup({ options }) {
		return {
			hooks: {
				"astro:config:setup": ({
					logger,
					addDevToolbarApp,
					command,
				}) => {
					logger.info("astro-themes initialized");

					// Add Dev Toolbar App in dev mode
					if (options.devToolbar && command === "dev") {
						addDevToolbarApp({
							id: "astro-themes-toolbar",
							name: "Theme Switcher",
							icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
							entrypoint: "@lpdsgn/astro-themes/toolbar",
						});
						logger.debug("Dev Toolbar App registered");
					}
				},
				"astro:config:done": ({ injectTypes }) => {
					// Inject global types for window.__ASTRO_THEMES__
					injectTypes({
						filename: "types.d.ts",
						content: `declare global {
  interface Window {
    __ASTRO_THEMES__?: {
      theme: string;
      resolvedTheme: string;
      systemTheme: "dark" | "light";
      forcedTheme?: string;
      themes: string[];
      setTheme: (theme: string | ((prevTheme: string) => string)) => void;
    };
  }
}
export {};`,
					});
				},
			},
		};
	},
});

export type { AstroThemesConfig, ThemeProviderProps };
