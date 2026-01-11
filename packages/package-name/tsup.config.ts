import { defineConfig } from "tsup";
import { peerDependencies } from "./package.json";

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
		external: [...Object.keys(peerDependencies)],
		tsconfig: "tsconfig.json",
		// Copy .astro files to dist
		async onSuccess() {
			const fs = await import("fs/promises");
			const path = await import("path");

			// Ensure components directory exists
			await fs.mkdir("dist/components", { recursive: true });

			// Copy .astro files
			const srcDir = "src/components";
			const files = await fs.readdir(srcDir);

			for (const file of files) {
				if (file.endsWith(".astro")) {
					await fs.copyFile(
						path.join(srcDir, file),
						path.join("dist/components", file)
					);
				}
			}
		},
	};
});
