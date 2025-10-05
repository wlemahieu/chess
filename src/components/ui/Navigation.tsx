import { useCallback, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { uiStore } from "../../stores/uiStore";

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const setShowOptions = uiStore((state) => state.setShowOptions);

  const handleOptionsClick = () => {
    setShowOptions(true);
    setMenuOpen(false);
  };

  const OptionsButtonDesktop = useCallback(() => {
    return (
      <button
        onClick={handleOptionsClick}
        className="hidden md:block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Options
      </button>
    );
  }, [handleOptionsClick, menuOpen]);

  const DropdownMenuMobile = useCallback(() => {
    return (
      <>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <button
              onClick={handleOptionsClick}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            >
              Options
            </button>
          </div>
        )}
      </>
    );
  }, [handleOptionsClick, menuOpen]);

  const HamburgerMenuMobile = useCallback(
    () => (
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-900 dark:text-white"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          )}
        </svg>
      </button>
    ),
    [menuOpen, setMenuOpen]
  );

  const ThemeToggle = useCallback(
    () => (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-900"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        )}
      </button>
    ),
    [toggleTheme]
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Chess
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <OptionsButtonDesktop />
          <HamburgerMenuMobile />
        </div>
      </div>
      <DropdownMenuMobile />
    </nav>
  );
}
