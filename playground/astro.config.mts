import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";

const { default: astroThemes } = await import("astro-themes");

// https://astro.build/config
export default defineConfig({
	integrations: [
		astroThemes(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../packages/astro-themes/dist"),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
