/**
 * Type definitions for astro-themes
 * Mirrors the next-themes API for Astro
 */

/** Data attribute pattern for HTML attributes */
type DataAttribute = `data-${string}`;

/** Attribute type - can be 'class' or any data-* attribute */
export type Attribute = DataAttribute | "class";

/** Mapping of theme name to HTML attribute value */
export interface ValueObject {
	[themeName: string]: string;
}

/** Props for the inline script element */
export interface ScriptProps {
	[key: string]: unknown;
}

/**
 * ThemeProvider component props
 * All your theme configuration is passed to ThemeProvider
 */
export interface ThemeProviderProps {
	/**
	 * Key used to store theme setting in localStorage
	 * @default 'theme'
	 */
	storageKey?: string;

	/**
	 * Default theme name. If `enableSystem` is false, the default theme is 'light'
	 * @default 'system'
	 */
	defaultTheme?: string;

	/**
	 * Forced theme name for the current page (does not modify saved theme settings)
	 */
	forcedTheme?: string;

	/**
	 * Whether to switch between `dark` and `light` based on `prefers-color-scheme`
	 * @default true
	 */
	enableSystem?: boolean;

	/**
	 * Whether to indicate to browsers which color scheme is used (dark or light)
	 * for built-in UI like inputs and buttons
	 * @default true
	 */
	enableColorScheme?: boolean;

	/**
	 * Optionally disable all CSS transitions when switching themes
	 * @default false
	 */
	disableTransitionOnChange?: boolean;

	/**
	 * List of theme names
	 * @default ['light', 'dark']
	 */
	themes?: string[];

	/**
	 * HTML attribute modified based on the active theme
	 * Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.)
	 * Can also be an array to set multiple attributes
	 * @default 'data-theme'
	 */
	attribute?: Attribute | Attribute[];

	/**
	 * Optional mapping of theme name to attribute value
	 * value is an `object` where key is the theme name and value is the attribute value
	 */
	value?: ValueObject;

	/**
	 * Optional nonce passed to the injected `script` tag, used to allow-list the script in your CSP
	 */
	nonce?: string;

	/**
	 * Optional props to pass to the injected `script` tag
	 */
	scriptProps?: ScriptProps;
}

/**
 * Theme state exposed to client-side JavaScript
 * Available via window.__ASTRO_THEMES__
 */
export interface ThemeState {
	/** Active theme name */
	theme: string;
	/** If the active theme is "system", this returns whether the system preference resolved to "dark" or "light" */
	resolvedTheme: string;
	/** System theme preference ("dark" or "light") regardless of active theme */
	systemTheme: "dark" | "light";
	/** Forced page theme or undefined */
	forcedTheme?: string;
	/** The list of themes */
	themes: string[];
	/** Update the theme */
	setTheme: (theme: string | ((prevTheme: string) => string)) => void;
}

/**
 * Configuration for the astro-themes integration
 */
export interface AstroThemesConfig {
	/**
	 * Enable the Dev Toolbar App for theme switching during development
	 * @default true
	 */
	devToolbar?: boolean;
}
