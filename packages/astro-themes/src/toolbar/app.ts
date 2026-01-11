/**
 * Astro Dev Toolbar App for theme switching
 * Uses native Astro Dev Toolbar components for consistent UI
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
	init(canvas, app) {
		// Create native window component
		const toolbarWindow = document.createElement(
			"astro-dev-toolbar-window"
		) as HTMLElement;

		// Add custom styles for our content
		const style = document.createElement("style");
		style.textContent = `
			.theme-content {
				display: flex;
  				flex-flow: row wrap;
			}

			.theme-section {
				margin-bottom: 1rem;
			}
			
			.theme-section:last-child {
				margin-bottom: 0;
			}
			
			.theme-label {
				font-size: 0.75rem;
				font-weight: 500;
				color: rgba(255, 255, 255, 0.7);
				margin-bottom: 0.5rem;
				text-transform: uppercase;
				letter-spacing: 0.05em;
			}
			
			.theme-status {
				display: flex;
				flex: 1 1 auto;
				width: 100%;
				align-items: center;
				gap: 0.75rem;
				padding: 1rem;
				box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px 0px rgba(0, 0, 0, 0.10), 0px 4px 4px 0px rgba(0, 0, 0, 0.09), 0px 10px 6px 0px rgba(0, 0, 0, 0.05), 0px 17px 7px 0px rgba(0, 0, 0, 0.01), 0px 26px 7px 0px rgba(0, 0, 0, 0.00);
				border: 1px solid rgba(35, 38, 45, 1);
				border-radius: .5rem;
				margin-bottom: 1rem;
			}
			
			.theme-status-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
				color: white;
			}
			
			.theme-status-icon svg {
				width: 24px;
				height: 24px;
			}
			
			.theme-status-text {
				font-size: 0.875rem;
				color: white;
			}
			
			.theme-status-resolved {
				font-size: 0.75rem;
				color: rgba(255, 255, 255, 0.5);
			}
			
			.theme-grid {
				display: flex;
				gap: 0.5rem;
			}
			
			.theme-grid astro-dev-toolbar-button svg {
				width: 16px;
				height: 16px;
			}
			
			.theme-divider {
				width: 1px;
				background: rgba(255, 255, 255, 0.1);
				margin: 0 1rem;
			}
			
			@media (max-width: 562px) {
				.theme-divider {
					height: 1px;
					margin: .2rem 0 1rem 0;
				}
				.theme-section, .theme-divider {
					flex: 1 1 auto;
					width: 100%;
				}
			}
			
			.quick-actions {
				display: flex;
				gap: 0.5rem;
			}
			
			.quick-actions astro-dev-toolbar-button {
				flex: 1;
			}
			
			.quick-actions astro-dev-toolbar-button svg {
				width: 16px;
				height: 16px;
			}
		`;
		toolbarWindow.appendChild(style);

		const lightModeIcon = `
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6M5.394 6.813L6.81 5.399l3.505 3.506L8.9 10.319zM2 15.005h5v2H2zm3.394 10.193L8.9 21.692l1.414 1.414l-3.505 3.506zM15 25.005h2v5h-2zm6.687-1.9l1.414-1.414l3.506 3.506l-1.414 1.414zm3.313-8.1h5v2h-5zm-3.313-6.101l3.506-3.506l1.414 1.414l-3.506 3.506zM15 2.005h2v5h-2z"/></svg>
		`;
		const darkModeIcon = `
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M13.503 5.414a15.076 15.076 0 0 0 11.593 18.194a11.1 11.1 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1 1 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.07 13.07 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3"/></svg>`;
		const systemModeIcon = `
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M10 30H4a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2M4 16v12h6V16Z"/><path fill="currentColor" d="M28 4H6a2 2 0 0 0-2 2v6h2V6h22v14H14v2h2v4h-2v2h9v-2h-5v-4h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/></svg>
		`;
		const defaultModeIcon = `
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><circle cx="10" cy="12" r="2" fill="currentColor"/><circle cx="16" cy="9" r="2" fill="currentColor"/><circle cx="22" cy="12" r="2" fill="currentColor"/><circle cx="23" cy="18" r="2" fill="currentColor"/><circle cx="19" cy="23" r="2" fill="currentColor"/><path fill="currentColor" d="M16.54 2A14 14 0 0 0 2 16a4.82 4.82 0 0 0 6.09 4.65l1.12-.31a3 3 0 0 1 3.79 2.9V27a3 3 0 0 0 3 3a14 14 0 0 0 14-14.54A14.05 14.05 0 0 0 16.54 2m8.11 22.31A11.93 11.93 0 0 1 16 28a1 1 0 0 1-1-1v-3.76a5 5 0 0 0-5-5a5 5 0 0 0-1.33.18l-1.12.31A2.82 2.82 0 0 1 4 16A12 12 0 0 1 16.47 4A12.18 12.18 0 0 1 28 15.53a11.9 11.9 0 0 1-3.35 8.79Z"/></svg>
		`;

		// Create content container
		const content = document.createElement("div");
		content.className = "theme-content";
		toolbarWindow.appendChild(content);

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
					return lightModeIcon;
				case "dark":
					return darkModeIcon;
				case "system":
					return systemModeIcon;
				default:
					return defaultModeIcon;
			}
		}

		function render() {
			const state = getThemeState();
			const currentTheme = state.theme;
			const resolvedTheme = state.resolvedTheme;
			const themes = state.themes.includes("system")
				? state.themes
				: [...state.themes, "system"];

			content.innerHTML = `
				<div class="theme-status">
					<span class="theme-status-icon">${getThemeIcon(resolvedTheme)}</span>
					<div>
						<div class="theme-status-text">${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</div>
						<div class="theme-status-resolved">Resolved: ${resolvedTheme}</div>
					</div>
				</div>
				
				<div class="theme-section">
					<div class="theme-label">Select Theme</div>
					<div class="theme-grid" id="theme-grid"></div>
				</div>
				
				<div class="theme-divider"></div>
				
				<div class="theme-section">
					<div class="theme-label">Quick Actions</div>
					<div class="theme-grid" id="quick-actions"></div>
				</div>
			`;

			// Create theme buttons using native components
			const themeGrid = content.querySelector("#theme-grid");
			if (themeGrid) {
				for (const theme of themes) {
					const btn = document.createElement(
						"astro-dev-toolbar-button"
					) as HTMLElement & {
						buttonStyle: string;
						size: string;
					};
					btn.innerHTML = `
						<span style="display:inline-flex;align-items:center;gap:0.5rem;">
							${getThemeIcon(theme).replace('width="32" height="32"', 'width="16" height="16"')} ${theme.charAt(0).toUpperCase() + theme.slice(1)}
						</span>
					`;
					btn.size = "medium";
					btn.buttonStyle = theme === currentTheme ? "purple" : "gray";
					btn.dataset.theme = theme;
					btn.addEventListener("click", () => {
						const state = getThemeState();
						state.setTheme(theme);
						setTimeout(render, 50);
					});
					themeGrid.appendChild(btn);
				}
			}

			// Create quick action buttons
			const quickActions = content.querySelector("#quick-actions");
			if (quickActions) {
				// Toggle button
				const toggleBtn = document.createElement(
					"astro-dev-toolbar-button"
				) as HTMLElement & {
					buttonStyle: string;
					size: string;
				};
				toggleBtn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M26 18A10 10 0 1 1 16 8h6.182l-3.584 3.585L20 13l6-6l-6-6l-1.402 1.414L22.182 6H16a12 12 0 1 0 12 12Z"/></svg> Toggle</span>`;
				toggleBtn.size = "medium";
				toggleBtn.buttonStyle = "outline";
				toggleBtn.addEventListener("click", () => {
					const state = getThemeState();
					const newTheme = state.resolvedTheme === "dark" ? "light" : "dark";
					state.setTheme(newTheme);
					setTimeout(render, 50);
				});
				quickActions.appendChild(toggleBtn);

				// System button
				const systemBtn = document.createElement(
					"astro-dev-toolbar-button"
				) as HTMLElement & {
					buttonStyle: string;
					size: string;
				};
				systemBtn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:0.5rem;">${systemModeIcon.replace('width="32" height="32"', 'width="16" height="16"')} System</span>`;
				systemBtn.size = "medium";
				systemBtn.buttonStyle = "outline";
				systemBtn.addEventListener("click", () => {
					const state = getThemeState();
					state.setTheme("system");
					setTimeout(render, 50);
				});
				quickActions.appendChild(systemBtn);
			}
		}

		// Initial render
		render();

		// Append window to canvas
		canvas.appendChild(toolbarWindow);

		// Handle app toggle visibility
		app.onToggled(({ state }) => {
			toolbarWindow.style.display = state ? "block" : "none";
		});

		// Initially hidden until toggled
		toolbarWindow.style.display = "none";

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
