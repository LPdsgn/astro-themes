import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import expressiveCode from "astro-expressive-code";
import { remarkNpm2Yarn } from '@theguild/remark-npm2yarn'
import astroThemes from "@lpdsgn/astro-themes"

// https://astro.build/config
export default defineConfig({
	integrations: [
		expressiveCode({
			themes: ["github-dark", "github-light"],
			themeCssSelector: (theme) =>
				theme.name.includes("light") ? "[data-theme='light']" : "[data-theme='dark']",
			styleOverrides: {
				borderRadius: "2px",
			},
		}),
		astroThemes(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../packages/astro-themes/dist"),
		}),
	],
	markdown: {
		remarkPlugins: [
			[remarkNpm2Yarn, {
				packageName: 'astro-themes',
				tabNamesProp: 'packageManagerTabs',
				storageKey: 'preferredPackageManager',
			}],
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
