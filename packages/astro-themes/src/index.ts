// Main integration export
import { integration } from "./integration.js";

export default integration;

// Re-export integration
export { integration };

// Re-export types
export type {
	Attribute,
	ValueObject,
	ScriptProps,
	ThemeProviderProps,
	ThemeState,
	AstroThemesConfig,
} from "./types.js";

// Re-export client helpers
export {
	getTheme,
	setTheme,
	getResolvedTheme,
	getSystemTheme,
	isForcedTheme,
	getThemes,
	onThemeChange,
	toggleTheme,
} from "./client.js";
