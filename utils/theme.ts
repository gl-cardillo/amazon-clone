export type Theme = "light" | "dark";

const THEME_KEY = "theme";

// runs before the first paint, so a saved dark theme never flashes light
export const themeScript = `try {
  var theme = localStorage.getItem("${THEME_KEY}");
  if (theme !== "light" && theme !== "dark") {
    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
} catch (e) {}`;

export function toggleTheme() {
  const root = document.documentElement;
  const theme: Theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // private mode can block storage, the toggle still works for this visit
  }
}
