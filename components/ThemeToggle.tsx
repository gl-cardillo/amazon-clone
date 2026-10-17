import { BsMoon, BsSun } from "react-icons/bs";
import { toggleTheme } from "../utils/theme";

// the icon is picked by css, so server and client render the same markup
export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-md p-1.5 text-xl text-foreground hover:bg-muted"
    >
      <BsMoon className="dark:hidden" />
      <BsSun className="hidden dark:block" />
    </button>
  );
}
