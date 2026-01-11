/**
 * Client-side helpers for interacting with the theme
 * These are meant to be used in client-side scripts
 */

import type { ThemeState } from "./types.js";

declare global {
	interface Window {
		__ASTRO_THEMES__?: ThemeState;
	}
}

/**
 * Get the current theme state
 * Returns undefined if ThemeProvider is not mounted
 */
export function getTheme(): ThemeState | undefined {
	if (typeof window === "undefined") return undefined;
	return window.__ASTRO_THEMES__;
}

/**
 * Set the theme
 * @param theme - Theme name or function that receives current theme and returns new theme
 */
export function setTheme(theme: string | ((prevTheme: string) => string)): void {
	const state = getTheme();
	if (state) {
		state.setTheme(theme);
	}
}

/**
 * Get the resolved theme (system theme resolved to actual value)
 */
export function getResolvedTheme(): string | undefined {
	return getTheme()?.resolvedTheme;
}

/**
 * Get the system theme preference
 */
export function getSystemTheme(): "dark" | "light" | undefined {
	return getTheme()?.systemTheme;
}

/**
 * Check if theme is forced for the current page
 */
export function isForcedTheme(): boolean {
	return !!getTheme()?.forcedTheme;
}

/**
 * Get the list of available themes
 */
export function getThemes(): string[] {
	return getTheme()?.themes ?? [];
}

/**
 * Subscribe to theme changes
 * @param callback - Function called when theme changes
 * @returns Cleanup function to unsubscribe
 */
export function onThemeChange(
	callback: (detail: { theme: string; resolvedTheme: string }) => void
): () => void {
	if (typeof window === "undefined") return () => {};

	const handler = (e: CustomEvent<{ theme: string; resolvedTheme: string }>) => {
		callback(e.detail);
	};

	window.addEventListener("astro-themes:change", handler as EventListener);

	return () => {
		window.removeEventListener("astro-themes:change", handler as EventListener);
	};
}

/**
 * Toggle between light and dark themes
 * If current theme is neither light nor dark, switches to light
 */
export function toggleTheme(): void {
	const state = getTheme();
	if (!state) return;

	const resolved = state.resolvedTheme;
	state.setTheme(resolved === "light" ? "dark" : "light");
}
