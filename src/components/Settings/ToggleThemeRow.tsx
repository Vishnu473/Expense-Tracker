import { FiMoon, FiSun } from 'react-icons/fi';

export const ThemeToggleRow = ({ theme, ToggleTheme }: { theme: 'light' | 'dark'; ToggleTheme: () => void }) => {
  return (
    <div className="flex justify-between items-center py-2 pl-2 rounded mt-2">
      <div className="flex items-center gap-3">
        <div className="bg-gray-300 dark:bg-gray-700 border border-gray-600 p-1 rounded-sm">
          {theme === 'light' ? (
            <FiMoon className="text-xl text-black dark:text-white" />
          ) : (
            <FiSun className="text-xl text-black dark:text-white" />
          )}
        </div>
        <p className="text-black dark:text-white">Theme</p>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={ToggleTheme}
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
