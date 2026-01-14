import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig((options) => {
	const dev = !!options.watch;
	return {
		entry: [
			"src/index.ts",
			"src/client.ts",
			"src/types.ts",
			"src/script.ts",
			"src/toolbar/app.ts",
		],
		format: ["esm"],
		target: "node18",
		bundle: true,
		dts: true,
		sourcemap: true,
		clean: true,
		splitting: false,
		minify: !dev,
		external: [...Object.keys(pkg.peerDependencies || {})],
		tsconfig: "tsconfig.json",
		// Copy .astro files to dist
		async onSuccess() {
			const fs = await import("fs/promises");
			const path = await import("path");

			// Ensure components directory exists
			await fs.mkdir("dist/components", { recursive: true });

			// Copy .astro files and type declarations
			const srcDir = "src/components";
			const files = await fs.readdir(srcDir);

			for (const file of files) {
				if (file.endsWith(".astro") || file.endsWith(".d.ts")) {
					await fs.copyFile(
						path.join(srcDir, file),
						path.join("dist/components", file)
					);
				}
			}

			// Create components/index.js that re-exports the .astro components
			const componentIndex = `// Auto-generated - re-exports Astro components
export { default as ThemeProvider } from "./ThemeProvider.astro";
`;
			await fs.writeFile("dist/components/index.js", componentIndex);
		},
	};
});
