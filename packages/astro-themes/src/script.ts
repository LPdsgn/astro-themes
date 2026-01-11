/**
 * Inline script that runs before page render to prevent flash
 * This script is injected into the head and executes immediately
 */
export function getInlineScript(
	attribute: string | string[],
	storageKey: string,
	defaultTheme: string,
	forcedTheme: string | undefined,
	themes: string[],
	value: Record<string, string> | undefined,
	enableSystem: boolean,
	enableColorScheme: boolean
): string {
	// The script must be minified and self-contained
	const script = `
(function() {
  var el = document.documentElement;
  var attribute = ${JSON.stringify(attribute)};
  var storageKey = ${JSON.stringify(storageKey)};
  var defaultTheme = ${JSON.stringify(defaultTheme)};
  var forcedTheme = ${JSON.stringify(forcedTheme)};
  var themes = ${JSON.stringify(themes)};
  var value = ${JSON.stringify(value)};
  var enableSystem = ${JSON.stringify(enableSystem)};
  var enableColorScheme = ${JSON.stringify(enableColorScheme)};
  var systemThemes = ['light', 'dark'];

  function updateDOM(theme) {
    var attributes = Array.isArray(attribute) ? attribute : [attribute];
    attributes.forEach(function(attr) {
      var isClass = attr === 'class';
      var classes = isClass && value ? themes.map(function(t) { return value[t] || t; }) : themes;
      if (isClass) {
        el.classList.remove.apply(el.classList, classes);
        el.classList.add(value && value[theme] ? value[theme] : theme);
      } else {
        el.setAttribute(attr, value && value[theme] ? value[theme] : theme);
      }
    });
    setColorScheme(theme);
  }

  function setColorScheme(theme) {
    if (enableColorScheme && systemThemes.indexOf(theme) !== -1) {
      el.style.colorScheme = theme;
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  if (forcedTheme) {
    updateDOM(forcedTheme);
  } else {
    try {
      var themeName = localStorage.getItem(storageKey) || defaultTheme;
      var isSystem = enableSystem && themeName === 'system';
      var theme = isSystem ? getSystemTheme() : themeName;
      updateDOM(theme);
    } catch (e) {
      updateDOM(defaultTheme === 'system' && enableSystem ? getSystemTheme() : defaultTheme);
    }
  }
})();
`.trim();

	return script;
}

/**
 * Returns a minified version of the inline script
 */
export function getMinifiedInlineScript(
	attribute: string | string[],
	storageKey: string,
	defaultTheme: string,
	forcedTheme: string | undefined,
	themes: string[],
	value: Record<string, string> | undefined,
	enableSystem: boolean,
	enableColorScheme: boolean
): string {
	// Minified version for production
	return getInlineScript(
		attribute,
		storageKey,
		defaultTheme,
		forcedTheme,
		themes,
		value,
		enableSystem,
		enableColorScheme
	)
		.replace(/\s+/g, " ")
		.replace(/\s*{\s*/g, "{")
		.replace(/\s*}\s*/g, "}")
		.replace(/\s*;\s*/g, ";")
		.replace(/\s*,\s*/g, ",")
		.replace(/\s*\(\s*/g, "(")
		.replace(/\s*\)\s*/g, ")")
		.trim();
}
