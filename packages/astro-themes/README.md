# astro-themes

![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Perfect dark mode in Astro with no flash. An Astro integration that mirrors the behavior of [next-themes](https://github.com/pacocoursey/next-themes).

## Features

- ✅ **Perfect dark mode in 2 lines of code**
- ✅ **No flash on load** (SSR and SSG)
- ✅ **System preference with `prefers-color-scheme`**
- ✅ **Themed browser UI with `color-scheme`**
- ✅ **Sync theme across tabs and windows**
- ✅ **Force pages to specific themes**
- ✅ **Class or data attribute selector**
- ✅ **TypeScript support**

## Quick Start

### 1. Install

```sh frame="none"
pnpm astro add @lpdsgn/astro-themes
```

```sh frame="none"
npx astro add @lpdsgn/astro-themes
```

```sh frame="none"
yarn astro add @lpdsgn/astro-themes
```

### 2. Add ThemeProvider

```astro frame="code" title="src/layouts/Layout.astro"
---
import { ThemeProvider } from "@lpdsgn/astro-themes/components";
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

That's it! Your Astro app now supports dark mode with system preference detection and cross-tab sync.

## Styling

### CSS Variables

By default, `@lpdsgn/astro-themes` sets `data-theme` on the `<html>` element:

```css frame="code" title="src/styles/global.css"
:root {
  --background: white;
  --foreground: black;
}

[data-theme='dark'] {
  --background: black;
  --foreground: white;
}
```

### TailwindCSS

For Tailwind's class-based dark mode, set `attribute="class"`:

```astro
<ThemeProvider attribute="class" />
```

Then configure Tailwind:

**Tailwind v4:**

```css frame="code" title="src/styles/global.css" ins={3}
@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));
```

**Tailwind v3:**

```js frame="code" title="tailwind.config.js" ins={2}
module.exports = {
  darkMode: 'selector',
}
```

Now use dark-mode classes:

```html
<h1 class="text-black dark:text-white">Hello</h1>
```

## Changing the Theme

### Using Client Helpers (Recommended)

```astro
<script>
  import { setTheme, toggleTheme, onThemeChange, getResolvedTheme } from '@lpdsgn/astro-themes';
  
  // Toggle between light and dark
  toggleTheme();
  
  // Set a specific theme
  setTheme('dark');
  
  // Get current resolved theme
  const current = getResolvedTheme(); // 'light' | 'dark'
  
  // Listen to theme changes
  const unsubscribe = onThemeChange(({ theme, resolvedTheme }) => {
    console.log('Theme changed:', resolvedTheme);
  });
</script>
```

### Using the Global Object

```html
<button id="theme-toggle">Toggle</button>

<script>
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const { resolvedTheme, setTheme } = window.__ASTRO_THEMES__;
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  });
</script>
```

## Configuration

### ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `'theme'` | localStorage key for theme setting |
| `defaultTheme` | `string` | `'system'` | Default theme (`'light'`, `'dark'`, or `'system'`) |
| `themes` | `string[]` | `['light', 'dark']` | Available theme names |
| `attribute` | `string \| string[]` | `'data-theme'` | HTML attribute to set. Use `'class'` for Tailwind |
| `value` | `object` | - | Map theme names to custom attribute values |
| `forcedTheme` | `string` | - | Force a specific theme on this page |
| `enableSystem` | `boolean` | `true` | Enable system preference detection |
| `enableColorScheme` | `boolean` | `true` | Set `color-scheme` CSS property |
| `disableTransitionOnChange` | `boolean` | `false` | Disable transitions when switching |
| `nonce` | `string` | - | CSP nonce for the script tag |
| `scriptProps` | `object` | - | Additional props for the script tag |

### Integration Options

The integration can be configured in your `astro.config.mjs`:

```js frame="code" title="astro.config.mjs"
import { defineConfig } from "astro/config";
import astroThemes from "@lpdsgn/astro-themes";

export default defineConfig({
  integrations: [
    astroThemes({
      devToolbar: true, // Enable Dev Toolbar App (default: true)
    }),
  ],
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `devToolbar` | `boolean` | `true` | Enable the Dev Toolbar App for theme switching during development |

## Examples

### Force a Page Theme

```astro frame="code" title="src/pages/dark-only.astro"
---
import { ThemeProvider } from "@lpdsgn/astro-themes/components";
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <ThemeProvider forcedTheme="dark" />
  <!-- This page is always dark -->
</Layout>
```

### Multiple Themes

```astro
<ThemeProvider themes={['light', 'dark', 'purple', 'pink']} />
```

### Custom Attribute Values

```astro
<ThemeProvider 
  attribute="data-theme"
  value={{ light: 'light-mode', dark: 'dark-mode' }} 
/>
```

### Disable Transitions on Change

```astro
<ThemeProvider disableTransitionOnChange />
```

### Cloudflare Rocket Loader

```astro
<ThemeProvider scriptProps={{ 'data-cfasync': 'false' }} />
```

## API Reference

### Client Helpers

Import from `@lpdsgn/astro-themes`:

| Function | Description |
|----------|-------------|
| `getTheme()` | Get complete theme state object |
| `setTheme(theme)` | Set theme (string or callback function) |
| `toggleTheme()` | Toggle between light and dark |
| `getResolvedTheme()` | Get resolved theme (`'light'` or `'dark'`) |
| `getSystemTheme()` | Get system preference |
| `getThemes()` | Get list of available themes |
| `isForcedTheme()` | Check if current page has forced theme |
| `onThemeChange(callback)` | Subscribe to changes (returns unsubscribe) |

### Theme State Object

Available via `window.__ASTRO_THEMES__`:

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `string` | Current theme name |
| `resolvedTheme` | `string` | Resolved theme (`'light'` or `'dark'`) |
| `systemTheme` | `'light' \| 'dark'` | System preference |
| `forcedTheme` | `string \| undefined` | Forced theme if set |
| `themes` | `string[]` | Available themes |
| `setTheme(theme)` | `function` | Update the theme |

## Avoiding Hydration Mismatch

Since the theme is unknown on the server, use CSS to conditionally show content:

```css
[data-theme='dark'] .light-only { display: none; }
[data-theme='light'] .dark-only { display: none; }
```

Or check in client-side scripts:

```astro
<script>
  if (window.__ASTRO_THEMES__) {
    const { resolvedTheme } = window.__ASTRO_THEMES__;
    // Update UI based on theme
  }
</script>
```

## Contributing

This package is structured as a monorepo:

- `playground` – Development testing environment
- `packages/astro-themes` – The integration package

```bash
pnpm i --frozen-lockfile
pnpm dev
```

## License

[MIT Licensed](https://github.com/LPdsgn/astro-themes/blob/main/LICENSE). Made with ❤️

## Acknowledgements

- Inspired by [next-themes](https://github.com/pacocoursey/next-themes) by Paco Coursey
- Built with [astro-integration-kit](https://github.com/florian-lefebvre/astro-integration-kit) by Florian Lefebvre
