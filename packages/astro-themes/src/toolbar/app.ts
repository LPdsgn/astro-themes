/**
 * Astro Dev Toolbar App for theme switching
 * Provides a visual interface to switch themes during development
 */

import { defineToolbarApp } from "astro/toolbar";

// Extend Window interface for this file
declare global {
	interface Window {
		__ASTRO_THEMES__?: {
			theme: string;
			resolvedTheme: string;
			systemTheme: "dark" | "light";
			forcedTheme?: string;
			themes: string[];
			setTheme: (theme: string | ((prevTheme: string) => string)) => void;
		};
	}
}

export default defineToolbarApp({
	init(canvas) {
		const style = document.createElement("style");
		style.textContent = `
			:host {
				display: block;
				padding: 1rem;
			}
			
			.theme-container {
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
			}
			
			.theme-header {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.5rem;
			}
			
			.theme-header h2 {
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				color: white;
			}
			
			.theme-status {
				font-size: 0.75rem;
				color: rgba(255, 255, 255, 0.7);
				background: rgba(255, 255, 255, 0.1);
				padding: 0.25rem 0.5rem;
				border-radius: 4px;
			}
			
			.theme-list {
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
			}
			
			.theme-btn {
				padding: 0.5rem 1rem;
				background: rgba(255, 255, 255, 0.1);
				border: 1px solid rgba(255, 255, 255, 0.2);
				border-radius: 6px;
				color: white;
				font-size: 0.875rem;
				cursor: pointer;
				transition: all 0.15s ease;
			}
			
			.theme-btn:hover {
				background: rgba(255, 255, 255, 0.2);
				border-color: rgba(255, 255, 255, 0.3);
			}
			
			.theme-btn.active {
				background: rgba(138, 99, 210, 0.5);
				border-color: rgba(138, 99, 210, 0.8);
			}
			
			.theme-btn .icon {
				display: inline-block;
				margin-right: 0.25rem;
			}
			
			.no-themes {
				color: rgba(255, 255, 255, 0.7);
				font-size: 0.875rem;
			}
			
			.quick-actions {
				display: flex;
				gap: 0.5rem;
				margin-top: 0.5rem;
				padding-top: 0.75rem;
				border-top: 1px solid rgba(255, 255, 255, 0.1);
			}
			
			.quick-btn {
				flex: 1;
				padding: 0.5rem;
				background: rgba(255, 255, 255, 0.05);
				border: 1px solid rgba(255, 255, 255, 0.15);
				border-radius: 6px;
				color: rgba(255, 255, 255, 0.8);
				font-size: 0.75rem;
				cursor: pointer;
				transition: all 0.15s ease;
			}
			
			.quick-btn:hover {
				background: rgba(255, 255, 255, 0.1);
				color: white;
			}
		`;
		canvas.appendChild(style);

		const container = document.createElement("div");
		container.className = "theme-container";
		canvas.appendChild(container);

		function getThemeState() {
			return (
				window.__ASTRO_THEMES__ || {
					theme: "system",
					resolvedTheme: window.matchMedia("(prefers-color-scheme: dark)")
						.matches
						? "dark"
						: "light",
					systemTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
						? ("dark" as const)
						: ("light" as const),
					themes: ["light", "dark", "system"],
					setTheme: (theme: string | ((prev: string) => string)) => {
						// Fallback: try localStorage
						const themeValue =
							typeof theme === "function"
								? theme(localStorage.getItem("theme") || "system")
								: theme;
						localStorage.setItem("theme", themeValue);
						window.location.reload();
					},
				}
			);
		}

		function getThemeIcon(theme: string): string {
			switch (theme) {
				case "light":
					return "☀️";
				case "dark":
					return "🌙";
				case "system":
					return "💻";
				default:
					return "🎨";
			}
		}

		function render() {
			const state = getThemeState();
			const currentTheme = state.theme;
			const resolvedTheme = state.resolvedTheme;
			const themes = state.themes.includes("system")
				? state.themes
				: [...state.themes, "system"];

			container.innerHTML = `
				<div class="theme-header">
					<h2>🎨 Theme Switcher</h2>
					<span class="theme-status">Current: ${currentTheme} (${resolvedTheme})</span>
				</div>
				<div class="theme-list">
					${themes
						.map(
							(theme) => `
						<button 
							class="theme-btn ${theme === currentTheme ? "active" : ""}" 
							data-theme="${theme}"
						>
							<span class="icon">${getThemeIcon(theme)}</span>
							${theme.charAt(0).toUpperCase() + theme.slice(1)}
						</button>
					`
						)
						.join("")}
				</div>
				<div class="quick-actions">
					<button class="quick-btn" data-action="toggle">
						🔄 Toggle Light/Dark
					</button>
					<button class="quick-btn" data-action="system">
						💻 Use System
					</button>
				</div>
			`;

			// Add event listeners
			for (const btn of container.querySelectorAll<HTMLButtonElement>(
				".theme-btn"
			)) {
				btn.addEventListener("click", () => {
					const theme = btn.dataset.theme;
					if (theme) {
						const state = getThemeState();
						state.setTheme(theme);
						setTimeout(render, 50);
					}
				});
			}

			for (const btn of container.querySelectorAll<HTMLButtonElement>(
				".quick-btn"
			)) {
				btn.addEventListener("click", () => {
					const action = btn.dataset.action;
					const state = getThemeState();

					if (action === "toggle") {
						const newTheme = state.resolvedTheme === "dark" ? "light" : "dark";
						state.setTheme(newTheme);
					} else if (action === "system") {
						state.setTheme("system");
					}
					setTimeout(render, 50);
				});
			}
		}

		// Initial render
		render();

		// Listen for theme changes
		window.addEventListener("astro-themes:change", () => {
			render();
		});

		// Listen for system theme changes
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				render();
			});
	},
});
