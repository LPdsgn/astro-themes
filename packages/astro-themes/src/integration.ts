import { defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import type { AstroThemesConfig, ThemeProviderProps } from "./types.js";
import { getMinifiedInlineScript } from "./script.js";

// Default configuration values
const DEFAULT_STORAGE_KEY = "theme";
const DEFAULT_THEME = "system";
const DEFAULT_THEMES = ["light", "dark"];
const DEFAULT_ATTRIBUTE = "data-theme";

// Options schema for the integration
const optionsSchema = z
	.object({
		/**
		 * Inject the flash-prevention script automatically via integration
		 * When true, you don't need to use ThemeProvider component
		 * @default false
		 */
		injectScript: z.boolean().default(false),
		/**
		 * Default theme configuration used when injectScript is true
		 */
		defaultProps: z
			.object({
				storageKey: z.string().default(DEFAULT_STORAGE_KEY),
				defaultTheme: z.string().default(DEFAULT_THEME),
				forcedTheme: z.string().optional(),
				enableSystem: z.boolean().default(true),
				enableColorScheme: z.boolean().default(true),
				disableTransitionOnChange: z.boolean().default(false),
				themes: z.array(z.string()).default(DEFAULT_THEMES),
				attribute: z
					.union([z.string(), z.array(z.string())])
					.default(DEFAULT_ATTRIBUTE),
				value: z.record(z.string()).optional(),
			})
			.default({}),
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
					injectScript,
					addDevToolbarApp,
					command,
				}) => {
					logger.info("astro-themes initialized");

					// Inject flash-prevention script if enabled
					if (options.injectScript) {
						const props = options.defaultProps;
						const script = getMinifiedInlineScript(
							props.attribute,
							props.storageKey,
							props.defaultTheme,
							props.forcedTheme,
							props.themes,
							props.value,
							props.enableSystem,
							props.enableColorScheme
						);
						injectScript("head-inline", script);
						logger.info("Flash-prevention script injected via integration");
					}

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
