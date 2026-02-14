import React, { useState, useEffect } from 'react';

/**
 * ThemeToggle Component
 * A stylish switch for light/dark mode.
 */
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/80 hover:scale-110 active:scale-95 transition-all shadow-lg border border-slate-200 dark:border-white/10"
      aria-label="Toggle Theme"
    >
      <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
    </button>
  );
};

export default ThemeToggle;
