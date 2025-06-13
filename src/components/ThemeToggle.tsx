import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function ThemeToggle() {
  const [isDark, setIsDark] = useLocalStorage('theme', false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative inline-flex h-10 w-18 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-200 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-200 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <Sun className="h-4 w-4 text-yellow-500" />
        <div className="w-4" />
      </div>
      <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-4" />
        <Moon className="h-4 w-4 text-blue-400" />
      </div>
      <div className={`relative h-6 w-6 rounded-full bg-white dark:bg-slate-300 shadow-sm transform transition-transform duration-200 ${isDark ? 'translate-x-4' : '-translate-x-4'}`} />
    </button>
  );
}