# `astro-themes`

Perfect dark mode in Astro with no flash. An Astro integration that mirrors the behavior of [next-themes](https://github.com/pacocoursey/next-themes).

## Features

- ✅ **Perfect dark mode in 2 lines of code**
- ✅ **System setting with `prefers-color-scheme`**
- ✅ **Themed browser UI with `color-scheme`**
- ✅ **No flash on load** (both SSR and SSG)
- ✅ **Sync theme across tabs and windows**
- ✅ **Disable flashing when changing themes**
- ✅ **Force pages to specific themes**
- ✅ **Class or data attribute selector**
- ✅ **TypeScript support**

## Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-themes
```

```bash
npx astro add astro-themes
```

```bash
yarn astro add astro-themes
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-themes
```

```bash
npm install astro-themes
```

```bash
yarn add astro-themes
```

2. Add the integration to your astro config

```diff
+import astroThemes from "astro-themes";

export default defineConfig({
  integrations: [
+    astroThemes(),
  ],
});
```

## Usage

### Basic Setup

Add the `ThemeProvider` component to your layout's `<head>`:

```astro
---
import ThemeProvider from "astro-themes/ThemeProvider.astro";
---

<!doctype html>
<html lang="en">
  <head>
    <ThemeProvider />
  </head>
  <body>
    <slot />
  </body>
</html>
```

That's it! Your Astro app fully supports dark mode, including System preference with `prefers-color-scheme`. The theme is also immediately synced between tabs.

### HTML & CSS

By default, `astro-themes` modifies the `data-theme` attribute on the `html` element:

```css
:root {
  /* Your default theme */
  --background: white;
  --foreground: black;
}

[data-theme='dark'] {
  --background: black;
  --foreground: white;
}
```

### With TailwindCSS

Set the attribute to `class` for Tailwind's class-based dark mode:

```astro
<ThemeProvider attribute="class" />
```

In your `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'selector', // or 'class' for older versions
  // ...
}
```

Now you can use dark-mode specific classes:

```html
<h1 class="text-black dark:text-white">Hello</h1>
```

### Changing the Theme

Use the global `window.__ASTRO_THEMES__` object to interact with the theme:

```html
<button id="theme-toggle">Toggle Theme</button>

<script>
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const themes = window.__ASTRO_THEMES__;
    if (themes) {
      const newTheme = themes.resolvedTheme === 'light' ? 'dark' : 'light';
      themes.setTheme(newTheme);
    }
  });
</script>
```

Or use the exported helper functions:

```astro
<script>
  import { setTheme, getResolvedTheme, onThemeChange, toggleTheme } from 'astro-themes/client';
  
  // Toggle between light and dark
  toggleTheme();
  
  // Set a specific theme
  setTheme('dark');
  
  // Get current resolved theme
  const current = getResolvedTheme();
  
  // Listen to theme changes
  const unsubscribe = onThemeChange(({ theme, resolvedTheme }) => {
    console.log('Theme changed to:', theme, resolvedTheme);
  });
</script>
```

## API

### ThemeProvider Props

All your theme configuration is passed to `ThemeProvider`:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `'theme'` | Key used to store theme setting in localStorage |
| `defaultTheme` | `string` | `'system'` | Default theme name. If `enableSystem` is false, defaults to `'light'` |
| `forcedTheme` | `string` | - | Forced theme name for the current page (does not modify saved theme settings) |
| `enableSystem` | `boolean` | `true` | Whether to switch between `dark` and `light` based on `prefers-color-scheme` |
| `enableColorScheme` | `boolean` | `true` | Whether to indicate to browsers which color scheme is used for built-in UI |
| `disableTransitionOnChange` | `boolean` | `false` | Optionally disable all CSS transitions when switching themes |
| `themes` | `string[]` | `['light', 'dark']` | List of theme names |
| `attribute` | `string \| string[]` | `'data-theme'` | HTML attribute modified based on the active theme. Accepts `class` and `data-*` |
| `value` | `object` | - | Optional mapping of theme name to attribute value |
| `nonce` | `string` | - | Optional nonce passed to the injected `script` tag for CSP |
| `scriptProps` | `object` | - | Optional props to pass to the injected `script` tag |

### Theme State (window.__ASTRO_THEMES__)

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `string` | Active theme name |
| `resolvedTheme` | `string` | If the active theme is "system", returns whether it resolved to "dark" or "light" |
| `systemTheme` | `'dark' \| 'light'` | System theme preference, regardless of active theme |
| `forcedTheme` | `string \| undefined` | Forced page theme or undefined |
| `themes` | `string[]` | List of themes (with "system" appended if `enableSystem` is true) |
| `setTheme(theme)` | `function` | Function to update the theme |

### Client Helpers

Import from `astro-themes/client`:

| Function | Description |
|----------|-------------|
| `getTheme()` | Get the current theme state |
| `setTheme(theme)` | Set the theme (string or function) |
| `getResolvedTheme()` | Get the resolved theme |
| `getSystemTheme()` | Get the system theme preference |
| `isForcedTheme()` | Check if theme is forced |
| `getThemes()` | Get list of available themes |
| `onThemeChange(callback)` | Subscribe to theme changes (returns unsubscribe function) |
| `toggleTheme()` | Toggle between light and dark themes |

## Examples

### Force a Page to a Specific Theme

```astro
---
import ThemeProvider from "astro-themes/ThemeProvider.astro";
---

<html>
  <head>
    <ThemeProvider forcedTheme="dark" />
  </head>
  <body class="dark-only-page">
    <!-- This page is always dark -->
  </body>
</html>
```

### Multiple Themes

```astro
<ThemeProvider themes={['light', 'dark', 'purple', 'pink']} />
```

### Custom Attribute Values

```astro
<ThemeProvider 
  attribute="data-theme"
  value={{ 
    light: 'light-mode',
    dark: 'dark-mode'
  }} 
/>
```

This will set `data-theme="light-mode"` or `data-theme="dark-mode"`.

### Disable Transitions on Theme Change

```astro
<ThemeProvider disableTransitionOnChange />
```

### With Cloudflare Rocket Loader

```astro
<ThemeProvider scriptProps={{ 'data-cfasync': 'false' }} />
```

## Avoiding Hydration Mismatch

Because we cannot know the theme on the server, avoid rendering theme-dependent UI until the client has mounted:

```astro
<script>
  // Only run on client
  if (typeof window !== 'undefined' && window.__ASTRO_THEMES__) {
    const theme = window.__ASTRO_THEMES__.resolvedTheme;
    // Update UI based on theme
  }
</script>
```

Or use CSS to show/hide content:

```css
[data-theme='dark'] .light-only {
  display: none;
}

[data-theme='light'] .dark-only {
  display: none;
}
```

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `packages/astro-themes` contains the actual package

Install dependencies using pnpm:

```bash
pnpm i --frozen-lockfile
```

Start the playground and package watcher:

```bash
pnpm dev
```

You can now edit files in `packages/astro-themes`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/your-username/astro-themes/blob/main/LICENSE). Made with ❤️.

## Acknowledgements

- Inspired by [next-themes](https://github.com/pacocoursey/next-themes) by Paco Coursey
- Created using [astro-integration-template](https://github.com/florian-lefebvre/astro-integration-template)
