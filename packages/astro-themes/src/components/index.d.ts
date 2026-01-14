// Type declarations for Astro components
import type { ThemeProviderProps } from "../types.js";

/**
 * ThemeProvider component for managing themes in Astro applications.
 * Place this component inside the `<head>` tag of your layout.
 *
 * @param {string} [storageKey='theme'] - Key used to store theme setting in localStorage
 * @param {string} [defaultTheme='system'] - Default theme name. If `enableSystem` is false, the default theme is 'light'
 * @param {string} [forcedTheme] - Forced theme name for the current page (does not modify saved theme settings)
 * @param {boolean} [enableSystem=true] - Whether to switch themes based on `prefers-color-scheme`
 * @param {boolean} [enableColorScheme=true] - Whether to indicate color scheme to browsers
 * @param {boolean} [disableTransitionOnChange=false] - Disable CSS transitions when switching themes
 * @param {string[]} [themes=['light', 'dark']] - List of theme names
 * @param {Attribute} [attribute='data-theme'] - HTML attribute to apply the theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.). Can also be an array to set multiple attributes
 * @param {ValueObject} [value] - Map theme names to custom attribute values, eg. `{ dark: 'dark-mode', light: 'light-mode' }`
 * @param {string} [nonce] - Optional nonce passed to the injected `script` tag, used to allow-list the script in your CSP
 * @param {ScriptProps} [scriptProps] - Additional props to pass to the internal script tag
 * 
 * @example
 * ```astro
 * <head>
 *   <ThemeProvider attribute="class" defaultTheme="system" />
 * </head>
 * ```
 */
export declare function ThemeProvider(props: ThemeProviderProps): any;
